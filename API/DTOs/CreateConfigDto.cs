using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateConfigDto
    {
        [Required]
        public long Price { get; set; }
        [Required]
        public int QuantityInStock { get; set; }
        [Required]
        public string Key { get; set; }
        [Required]
        public string Value { get; set; }
        public IFormFile File { get; set; }
        [Required]
        public int ProductId { get; set; }
    }
}