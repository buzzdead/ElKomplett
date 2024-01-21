using System.Runtime.CompilerServices;
using API.DTOs.Product;
using API.Entities.ConfigAggregate;
using AutoMapper;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        private readonly EntityMappingCache _mappingCache;

        private readonly ProductService _productService;
        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService, EntityMappingCache mappingCache, ProductService productService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _context = context;
            _mappingCache = mappingCache;
            _productService = productService;
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
            foreach (var config in product.Configurables)
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
            if (id != 0)
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
            var productType = new ProductType { Name = createProducerOrType.Name };
            _context.ProductTypes.Add(productType);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(productType);
            return BadRequest(new ProblemDetails { Title = "Problem creating new product type" });
        }
        [HttpDelete("DeleteProducer/{name}")]
        public async Task<ActionResult> DeleteProducer(string name)
        {
            await _productService.RemoveProducer(name);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting producer" });
        }
        [HttpDelete("DeleteProductType/{name}")]
        public async Task<ActionResult> DeleteProductType(string name)
        {
            await _productService.RemoveProductType(name);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product type" });
        }
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {

            if (productDto.Order.Count > 0) productDto = (CreateProductDto)await this.SortImagesPre(productDto);

            var producer = await _mappingCache.GetProducerFromName(productDto.ProducerName);
            var productType = await _mappingCache.GetProductTypeFromName(productDto.ProductTypeName);
            var product = _mapper.Map<Product>(productDto);
            product.Producer = producer;
            product.ProductType = productType;

            product = (Product)await this.AddImagesAsync(productDto.Files, product, _imageService);

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
            try
            {
                productDto = (UpdateProductDto)await this.SortImagesPre(productDto);
                var product = await _productService.GetProductWithRelations(productDto.Id);

                if (product == null) return NotFound();

                UpdateProductDetails(productDto, product);

                if (productDto.Files.Count != 0)
                {
                    product = (Product)await this.AddImagesAsync(productDto.Files, product, _imageService);
                    if (!ModelState.IsValid) return BadRequest(ModelState);
                }

                product = (Product)await this.SortImagesPost(product, productDto);

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Ok(product);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
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

            var product = await _productService.GetProductWithRelations(id);

            _mappingCache.ProductUpdate(product.categoryId, product, true);

            if (product == null) return NotFound();
            _productService.DeleteImages(product.Images).Wait();
            _productService.RemoveConfigurations(product);
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
            return BadRequest(new ProblemDetails { Title = "Problem setting category" });
        }
        private async void UpdateProductDetails(UpdateProductDto productDto, Product product)
        {
            var producer = await _mappingCache.GetProducerFromName(productDto.ProducerName);
            var productType = await _mappingCache.GetProductTypeFromName(productDto.ProductTypeName);

            product.Producer = producer;
            product.ProductType = productType;

            _mapper.Map(productDto, product);
            _mappingCache.ProductUpdate(product.categoryId, product);
        }
    }
}