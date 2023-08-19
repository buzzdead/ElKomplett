namespace API.Controllers

{
    public class CategoryController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly ImageService _imageService;
        private readonly UserManager<User> _userManager;
        public CategoryController(StoreContext context, ImageService imageService, UserManager<User> userManager)
        {
            _userManager = userManager;
            _imageService = imageService;
            _context = context;

        }

        [HttpGet("GetCategories")]
        public async Task<ActionResult<Category>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync(); // Make sure to await the async operation

            return Ok(categories); // Return an OkObjectResult with the categories
        }

        [HttpGet("{id}", Name = "GetCategory")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
           var category = await _context.Categories.FindAsync(id);
           if(category == null) return NotFound();

           return category;
        }

        [Authorize(Roles = "Admin, Test")]
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(int id, string title, string pictureUrl)
        {
            var newCategory = new Category
            {
                Id = id,
                Title = title,
                PictureUrl = pictureUrl
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if(category == null) return NotFound();
            _context.Categories.Remove(category);
             var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting category" });

        }

    }
}