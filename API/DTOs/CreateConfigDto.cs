using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class CreateConfigDto
    {
         public int? Id { get; set; }
        public long Price { get; set; }
        public int QuantityInStock { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public IFormFile File { get; set; }
        public int? ProductId { get; set; }
        public bool? defaultProduct { get; set; }
    }
}