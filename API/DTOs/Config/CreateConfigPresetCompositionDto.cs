using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DTOs.Config
{
    public class CreateConfigPresetCompositionDto
    {
        [Required]
        public string Key { get; set; }
        public List<ConfigPresetDto> ConfigPresets { get; set; } = new();
    }
}