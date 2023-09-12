using System.Runtime.CompilerServices;
using API.DTOs.Product;
using API.Entities.ConfigAggregate;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Controllers
{
    public class EditorController : BaseApiController
    {
        private readonly StoreContext _context;
        public EditorController(StoreContext context)
        {
            _context = context;
        }
    
    [HttpPost]
    public async Task<ActionResult<Product>> PostDescription([FromForm] CreateDescriptionDto createDescriptionDto)
    {
        var product = await _context.Products.FindAsync(createDescriptionDto.ProductId);

        product.RichDescription = createDescriptionDto.RichText;
        
        var result = await _context.SaveChangesAsync() > 0;

        if(result) return Ok(product);

        return BadRequest(new ProblemDetails { Title = "Problem updating description" });

    }
    }
}