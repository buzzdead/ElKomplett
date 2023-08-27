using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UpdateConfigDto : Sortable
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
        public List<IFormFile> Files { get; set; }
        public List<string> Order { get; set; }
    }
}