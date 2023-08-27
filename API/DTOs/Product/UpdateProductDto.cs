using System.ComponentModel.DataAnnotations;
namespace API.DTOs
{
    public class UpdateProductDto : Sortable
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(100, Double.PositiveInfinity)]
        public long Price { get; set; }
        public List<IFormFile> Files { get; set; } = new();
        [Required]
        public string Type { get; set; }
        [Required]
        public string Brand { get; set; }
        [Required]
        [Range(0, 200)]
        public int QuantityInStock { get; set; }
        public List<string> Order { get; set; } = new();
        public int categoryId {get; set;}
    }
}