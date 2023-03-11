using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Config
{
    public class ConfigPresetDto
    {
        [Required]
        public string Value { get; set; }
        public string Key { get; set; }

    }
}