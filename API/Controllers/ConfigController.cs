using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ConfigController : BaseApiController
    {
        private readonly StoreContext _context;
        public ConfigController(StoreContext context)
        {
            _context = context;
            
        }
        [HttpDelete(Name = "DeleteConfigs")]
             public async Task<ActionResult> DeleteConfigs(int id)
        {
            var configProducts = _context.Products.Where(p => p.Configurable == true);
            _context.Products.RemoveRange(configProducts);
            var configs = _context.Config;
            _context.Config.RemoveRange(configs);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem deleting config" });

        }
        [HttpPost(Name = "AddConfig")]
        public async Task<ActionResult> AddConfig(int id, Config config)
        {
            var product = await _context.Products.FindAsync(id);
            product.AddItem(config);
            var result = await _context.SaveChangesAsync() > 0;
            if(result) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem updaintg config" });
            
        }
        [HttpDelete("{id}", Name = "RemoveConfigs")]
        public async Task<ActionResult> RemoveConfig(int id)
{
            var cfg = await _context.Config.FindAsync(id);

            var productId = cfg.ProductId;

            var product = await _context.Products.FindAsync(productId);
            product.RemoveItem(cfg);

            _context.Config.Remove(cfg);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }
        
    }
}