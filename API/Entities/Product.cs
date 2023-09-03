using API.Entities.ConfigAggregate;

namespace API.Entities
{
    public class Product : ImageAdder
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public int QuantityInStock { get; set; }
        public int categoryId { get; set; }
        public List<Config> Configurables { get; set; } = new ();
        public List<Image> Images { get; set; } = new();
        public List<ConfigPreset> ConfigPresets { get; set; } = new();
        public Producer Producer { get; set; }
        public ProductType ProductType { get; set; }

        public void AddConfig(Config config) 
        {
            Configurables.Add(new Config{
                ProductId = Id,
                QuantityInStock = config.QuantityInStock,
                Price = config.Price,
                Key = config.Key,
                Value = config.Value,
                Images = config.Images
            });
        }
        public void RemoveConfig(Config config)
        {
            Configurables.Remove(config);
        }

        public void AddConfigPreset(ConfigPreset configPreset) 
        {
            ConfigPresets.Add(configPreset);
        }
        public void AddImage(Image imageDto)
        {
            Images.Add(imageDto);
        }
        public void RemoveImage(Image imageDto) {
            Images.Remove(imageDto);
        }
    }
}