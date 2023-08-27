
namespace API.DTOs
{
    public class CategoryDto
{
    public int Id { get; set; }
    public IFormFile File { get; set; }
    public string Description { get; set; }
    public string Title { get; set; }
}
}