using AutoMapper;

namespace API.Controllers
{
    public class ConfigController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        private readonly UserManager<User> _userManager;
        public ConfigController(StoreContext context, IMapper mapper, ImageService imageService, UserManager<User> userManager)
        {
            _userManager = userManager;
            _imageService = imageService;
            _mapper = mapper;
            _context = context;

        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPost(Name = "AddConfig")]
        public async Task<ActionResult<Config>> AddConfig([FromForm] CreateConfigDto configDto)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var hasToken = await ControllerExtensions.TestAdminRequest(user, _userManager);
            if (!hasToken) return BadRequest(new ProblemDetails { Title = "Admin access has expired, try again later." });

            var config = _mapper.Map<Config>(configDto);

            var product = await _context.Products.FindAsync(configDto.ProductId);

            config = (Config)await this.AddImageAsync(configDto.File, config, _imageService);
            if (!ModelState.IsValid) return BadRequest(ModelState);

            product.AddItem(config);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(config);

            return BadRequest(new ProblemDetails { Title = "Problem updaintg config" });

        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateConfig([FromForm] UpdateConfigDto configDto)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var hasToken = await ControllerExtensions.TestAdminRequest(user, _userManager);
            if (!hasToken) return BadRequest(new ProblemDetails { Title = "Admin access has expired, try again later." });

            var config = await _context.Config.FindAsync(configDto.Id);

            if (config == null) return NotFound();

            _mapper.Map(configDto, config);
            if (configDto.File != null)
            {
                config = (Config)await this.AddImageAsync(configDto.File, config, _imageService);
                if (!ModelState.IsValid) return BadRequest(ModelState);
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(config);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }

        [Authorize(Roles = "Admin, Test")]
        [HttpDelete("{id}", Name = "RemoveConfigs")]
        public async Task<ActionResult> RemoveConfig(int id)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var hasToken = await ControllerExtensions.TestAdminRequest(user, _userManager);
            if (!hasToken) return BadRequest(new ProblemDetails { Title = "Admin access has expired, try again later." });

            var cfg = await _context.Config.FindAsync(id);

            var productId = cfg.ProductId;

            var product = await _context.Products.FindAsync(productId);

            if (!string.IsNullOrEmpty(cfg.PublicId) && cfg.PublicId != "0")
                await _imageService.DeleteImageAsync(cfg.PublicId);

            _context.Config.Remove(cfg);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }

    }
}