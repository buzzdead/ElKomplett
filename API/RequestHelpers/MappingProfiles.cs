
using API.DTOs;
using API.DTOs.Config;
using API.Entities;
using API.Entities.ConfigAggregate;
using AutoMapper;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            CreateMap<CreateConfigDto, Config>();
            CreateMap<UpdateConfigDto, Config>();
            CreateMap<CreateConfigPresetCompositionDto, ConfigPresetComposition>();
            CreateMap<ConfigPresetDto, ConfigPreset>();
        }
        
    }
}