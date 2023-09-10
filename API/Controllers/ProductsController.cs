using System.Runtime.CompilerServices;
using API.DTOs.Product;
using AutoMapper;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        private readonly UserManager<User> _userManager;
        private readonly EntityMappingCache _mappingCache;
        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService, UserManager<User> userManager, EntityMappingCache mappingCache)
        {
            _userManager = userManager;
            _imageService = imageService;
            _mapper = mapper;
            _context = context;
            _mappingCache = mappingCache;

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products
            .Include(p => p.Configurables)
            .ThenInclude(p => p.Images)
            .Include(p => p.ConfigPresets)
            .Include(p => p.Images)
            .Include(p => p.Producer)
            .Include(p => p.ProductType)
            .Filter(productParams.Producers, productParams.ProductTypes, productParams.categoryId, _mappingCache)
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .AsQueryable();

            var products = await PagedList<Product>
                .ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            foreach (var product in products)
                {
                    product.Images = product.Images.OrderBy(image => image.Order).ToList();
                    foreach (var config in product.Configurables) 
                    {
                        config.Images = config.Images.OrderBy(image => image.Order).ToList();
                    }
                }

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }
        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.Include(p => p.Configurables).ThenInclude(p => p.Images).Include(d => d.ConfigPresets).Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);

            product.Images = product.Images.OrderBy(image => image.Order).ToList();
            foreach(var config in product.Configurables) 
            {
                config.Images = config.Images.OrderBy(image => image.Order).ToList();
            }

            return product;
        }

        [HttpGet("GetFilters/{id}")]
        public async Task<IActionResult> GetFilters(int id)
        {
            var producers = await _context.Producers.ToListAsync();
            var productTypes = await _context.ProductTypes.ToListAsync();
            if(id != 0)
            {
                var (producerNames, productTypeNames) = _mappingCache.GetProducersAndProductTypes(id);
                producers = producers.Where(p => producerNames.Contains(p.Name)).ToList();
                productTypes = productTypes.Where(p => productTypeNames.Contains(p.Name)).ToList();
            }

            return Ok(new { producers, productTypes });
        }

        [HttpPost("AddProducer")]
        public async Task<ActionResult<Producer>> CreateProducer([FromForm] ProdcuerOrProductType createProducerOrType)
        {
            var producer = new Producer { Name = createProducerOrType.Name };
            _context.Producers.Add(producer);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(producer);

            return BadRequest(new ProblemDetails { Title = "Problem creating new producer" });
        }

        [HttpPost("AddProductType")]
        public async Task<ActionResult<ProductType>> CreateProductType([FromForm] ProdcuerOrProductType createProducerOrType)
        {
            var productType = new ProductType{ Name = createProducerOrType.Name };
            _context.ProductTypes.Add(productType);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(productType);
            return BadRequest(new ProblemDetails { Title = "Problem creating new product type" });
        }
        [HttpDelete("DeleteProducer/{name}")]
        public async Task<ActionResult> DeleteProducer(string name)
        {
            var producerId = _mappingCache.GetProducerIdFromName(name);
            var myProducts = _context.Products.Where(p => p.Producer.Id == producerId);
            await myProducts.ForEachAsync(p => p.Producer = null);
            var producer = await _context.Producers.FindAsync(producerId);
            _context.Producers.Remove(producer);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting producer" });
        }
         [HttpDelete("DeleteProductType/{name}")]
        public async Task<ActionResult> DeleteProductType(string name)
        {
            var productTypeId = _mappingCache.GetProductTypeIdFromName(name);
            var myProducts = _context.Products.Where(p => p.ProductType.Id == productTypeId);
            await myProducts.ForEachAsync(p => p.ProductType = null);
            var productType = await _context.ProductTypes.FindAsync(productTypeId);
            _context.ProductTypes.Remove(productType);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product type" });
        }
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            if(productDto.Order.Count > 0)  productDto = (CreateProductDto) await this.SortImagesPre(productDto);

            var producerId = _mappingCache.GetProducerIdFromName(productDto.ProducerName);

            var productTypeId = _mappingCache.GetProductTypeIdFromName(productDto.ProductTypeName);

            var producer = await _context.Producers.FindAsync(producerId);

            var productType = await _context.ProductTypes.FindAsync(productTypeId);

            var product = _mapper.Map<Product>(productDto);

            product.Producer = producer;

            product.ProductType = productType;

            product = (Product) await this.AddImagesAsync(productDto.Files, product, _imageService);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            for (int i = 0; i < product.Images.Count; i++) product.Images[i].Order = i;

            _context.Products.Add(product);

            _mappingCache.ProductUpdate(product.categoryId, product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            productDto = (UpdateProductDto) await this.SortImagesPre(productDto);

            var product = await _context.Products.Include(p => p.Images).Include(p => p.Producer).Include(p => p.ProductType).FirstOrDefaultAsync(p => p.Id == productDto.Id);

            _mappingCache.ProductUpdate(product.categoryId, product, true);

            var producerId = _mappingCache.GetProducerIdFromName(productDto.ProducerName);

            var productTypeId = _mappingCache.GetProductTypeIdFromName(productDto.ProductTypeName);

            var producer = await _context.Producers.FindAsync(producerId);

            var productType = await _context.ProductTypes.FindAsync(productTypeId);

            product.Producer = producer;
            product.ProductType = productType;

            _mappingCache.ProductUpdate(product.categoryId, product);
 
            if (product == null) return NotFound();

            _mapper.Map(productDto, product);
            if(productDto.Files.Count != 0){
            product = (Product) await this.AddImagesAsync(productDto.Files, product, _imageService);
            if (!ModelState.IsValid) return BadRequest(ModelState);}

            product = (Product) await this.SortImagesPost(product, productDto);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpPut("SetDefaultConfig")]
        public async Task<ActionResult<Product>> SetDefaultConfig([FromForm] SetDefaultProductDto setDefaultProductDto)
        {
           
            var product = await _context.Products.FindAsync(setDefaultProductDto.Id);

            if (product == null) return NotFound();

            product.Price = setDefaultProductDto.Price;
            product.QuantityInStock = setDefaultProductDto.QuantityInStock;
            product.Images[0].PictureUrl = setDefaultProductDto.PictureUrl;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {

            var product = await _context.Products.Include(p => p.Producer).Include(p => p.ProductType).FirstOrDefaultAsync(p => p.Id == id);

            _mappingCache.ProductUpdate(product.categoryId, product, true);

            if (product == null) return NotFound();

            // Will crash app if 
            foreach (ImageDto image in product.Images)
            {
                if (!string.IsNullOrEmpty(image.PublicId) && image.PublicId != "0")
                    await _imageService.DeleteImageAsync(image.PublicId);
            }

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpPut("setCategory")]
        public async Task<ActionResult> setCategory(int categoryId, int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            product.categoryId = categoryId;
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem setting category"});
        }
    }
}