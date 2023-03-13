using API.Entities.ConfigAggregate;

namespace API.Entities
{
    public class Product : ImageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public string PictureUrl { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
        public string PublicId { get; set; }
        public List<Config> Configurables { get; set; } = new ();
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
    }
}