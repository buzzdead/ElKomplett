using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UpdateConfigDto
    {
        public int Id { get; set; }
        [Required]
        public long Price { get; set; }
        [Required]
        public int QuantityInStock { get; set; }
        [Required]
        public string Key { get; set; }
        [Required]
        public string Value { get; set; }
        public IFormFile File { get; set; }
    }
}