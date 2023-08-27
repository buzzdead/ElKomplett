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
        public async Task<ActionResult<Category>> CreateCategory([FromForm] CategoryDto categoryDto)
        {
                var imageResult = await _imageService.AddImageAsync(categoryDto.File);

                if (imageResult.Error != null)
                {
                    return BadRequest();
                }
            

            var pictureUrl = imageResult.SecureUrl.ToString();

            var newCategory = new Category
            {
                Id = categoryDto.Id,
                Title = categoryDto.Title,
                PictureUrl = pictureUrl,
                Description = categoryDto.Description
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [Authorize(Roles = "Admin, Test")]
        [HttpPut("{id}", Name = "EditCategory")]
        public async Task<ActionResult<Category>> EditCategory([FromForm] CategoryDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(categoryDto.Id);
            if(categoryDto.Description != null) category.Description = categoryDto.Description;
            if(categoryDto.Title != null) category.Title = categoryDto.Title;
            if(categoryDto.File != null) {
                 var imageResult = await _imageService.AddImageAsync(categoryDto.File);

                if (imageResult.Error != null)
                {
                    return BadRequest();
                }
            

            category.PictureUrl = imageResult.SecureUrl.ToString();

            }

            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpDelete("{id}", Name = "DeleteCategory")]
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