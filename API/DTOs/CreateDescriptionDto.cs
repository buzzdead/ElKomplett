using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class CreateDescriptionDto
    {
        public string RichText { get; set; }
        public int ProductId { get; set; }
    }
}