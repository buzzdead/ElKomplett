using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(100, Double.PositiveInfinity)]
        public long Price { get; set; }
        [Required]
        public List<IFormFile> Files { get; set; } = new();
        public string Type { get; set; }
        [Required]
        public string Brand { get; set; }
        [Required]
        [Range(0, 200)]
        public int QuantityInStock { get; set; }
        public int categoryId { get; set; }
        public List<string> Order { get; set; } = new();
        
    }
}