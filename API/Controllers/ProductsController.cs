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
            .Include(p => p.ConfigPresets)
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();

            var products = await PagedList<Product>
                .ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }
        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.Include(p => p.Configurables).Include(d => d.ConfigPresets).FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var hasToken = await ControllerExtensions.TestAdminRequest(user, _userManager);
            if (!hasToken) return BadRequest(new ProblemDetails { Title = "Admin access has expired, try again later." });
            
            var product = _mapper.Map<Product>(productDto);
            product = (Product) await this.AddImageAsync(productDto.File, product, _imageService);
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var hasToken = await ControllerExtensions.TestAdminRequest(user, _userManager);
            if (!hasToken) return BadRequest(new ProblemDetails { Title = "Admin access has expired, try again later." });

            var product = await _context.Products.FindAsync(productDto.Id);

            if (product == null) return NotFound();

            _mapper.Map(productDto, product);
            if(productDto.File != null){
            product = (Product) await this.AddImageAsync(productDto.File, product, _imageService);
            if (!ModelState.IsValid) return BadRequest(ModelState);}

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var hasToken = await ControllerExtensions.TestAdminRequest(user, _userManager);
            if (!hasToken) return BadRequest(new ProblemDetails { Title = "Admin access has expired, try again later." });

            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            // Will crash app if 

            if (!string.IsNullOrEmpty(product.PublicId) && product.PublicId != "0")
                await _imageService.DeleteImageAsync(product.PublicId);

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
    }
}