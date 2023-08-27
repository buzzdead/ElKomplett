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
        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService, UserManager<User> userManager)
        {
            _userManager = userManager;
            _imageService = imageService;
            _mapper = mapper;
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products
            .Include(p => p.Configurables)
            .ThenInclude(p => p.Images)
            .Include(p => p.ConfigPresets)
            .Include(p => p.Images)
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types, productParams.categoryId)
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

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            if(productDto.Order.Count > 0)  productDto = (CreateProductDto) await this.SortImagesPre(productDto);

            var product = _mapper.Map<Product>(productDto);
            product = (Product) await this.AddImagesAsync(productDto.Files, product, _imageService);
            if (!ModelState.IsValid) return BadRequest(ModelState);
            for (int i = 0; i < product.Images.Count; i++) product.Images[i].Order = i;

            _context.Products.Add(product);


            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            productDto = (UpdateProductDto) await this.SortImagesPre(productDto);

            var product = await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == productDto.Id);
 
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

            var product = await _context.Products.FindAsync(id);

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