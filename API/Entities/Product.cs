using API.Entities.ConfigAggregate;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
        public int categoryId { get; set; }
        public List<Config> Configurables { get; set; } = new ();
        public List<Image> Images { get; set; } = new();
        public List<ConfigPreset> ConfigPresets { get; set; } = new();

        public void AddConfig(Config config) 
        {
            Configurables.Add(new Config{
                ProductId = Id,
                QuantityInStock = config.QuantityInStock,
                Price = config.Price,
                Key = config.Key,
                Value = config.Value,
                PublicId = config.PublicId,
                PictureUrl = config.PictureUrl,
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