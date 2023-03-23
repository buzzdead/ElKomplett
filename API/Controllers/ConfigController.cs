using System.Diagnostics.CodeAnalysis;
using API.DTOs.Config;
using API.Entities.ConfigAggregate;
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
        public async Task<ActionResult<Config>> AddConfig([FromForm] CreateConfigDto createConfigDto)
        {
            var config = _mapper.Map<Config>(createConfigDto);

            var product = await _context.Products.FindAsync(createConfigDto.ProductId);

            config = (Config)await this.AddImageAsync(createConfigDto.File, config, _imageService);
            if (!ModelState.IsValid) return BadRequest(ModelState);

            product.AddConfig(config);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(config);

            return BadRequest(new ProblemDetails { Title = "Problem updaintg config" });

        }

        [Authorize(Roles = "Admin, Test")]
        [HttpGet("GetConfigPresets")]
        public async Task<ActionResult<List<ConfigPresetComposition>>> GetConfigPresets()
        {
            var configPresetCompositions = await _context.ConfigPresetCompositions.Include(p => p.Configurations).ToListAsync();
            return configPresetCompositions;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Config>> GetConfig(int id)
        {
            var config = await _context.Config.FindAsync(id);
            return Ok(config);
        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPost("CreateConfigPresetComposition")]
        public async Task<ActionResult<ConfigPresetComposition>> CreateConfigPresetComposition(CreateConfigPresetCompositionDto createConfigPresetCompositionDto)
        {
            var configPresetComposition = _mapper.Map<ConfigPresetComposition>(createConfigPresetCompositionDto);

            configPresetComposition.Configurations.AddRange(_mapper.Map<List<ConfigPreset>>(createConfigPresetCompositionDto.ConfigPresets));

            configPresetComposition.Configurations.ForEach(e => e.Key = configPresetComposition.Key);

            await _context.ConfigPresetCompositions.AddAsync(configPresetComposition);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(configPresetComposition);
            
            else return BadRequest(new ProblemDetails { Title = "Problem creating config preset composition" });

        }
        [HttpDelete("DeleteCompositions")]
        public async Task<ActionResult> DeleteConfigPresetCompositions()
        {
            var presetCompositions = _context.ConfigPresetCompositions.Include(p => p.Configurations);
            _context.ConfigPresetCompositions.RemoveRange(presetCompositions);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPost("AddConfigPresetComposition/{productId}")]
        public async Task<ActionResult<Product>> AddConfigPreset(int productId, [FromBody] ConfigPresetDto configPresetDto)
        {
            var product = await _context.Products.FindAsync(productId);

            var configPreset = _mapper.Map<ConfigPreset>(configPresetDto);

            product.AddConfigPreset(configPreset);

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                return Ok(product);
            else
                return BadRequest(new ProblemDetails { Title = "Problem adding compositions" });
        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateConfig([FromForm] UpdateConfigDto configDto)
        {
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
        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveConfig(int id)
        {

            var cfg = await _context.Config.FindAsync(id);

            var productId = cfg.ProductId;

            var product = await _context.Products.FindAsync(productId);
            product.RemoveConfig(cfg);

            if (!string.IsNullOrEmpty(cfg.PublicId) && cfg.PublicId != "0")
                await _imageService.DeleteImageAsync(cfg.PublicId);

            _context.Config.Remove(cfg);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }

    }
}