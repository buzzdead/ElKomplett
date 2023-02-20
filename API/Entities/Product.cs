using System.Linq;

namespace API.Entities
{
    public class Product
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
        public bool? Configurable { get; set; }
        public List<Config> Configurables { get; set; } = new ();

        public void AddItem(Config config) 
        {
            Configurables.Add(new Config{
                ProductId = Id,
                QuantityInStock = config.QuantityInStock,
                Price = config.Price,
                Key = config.Key,
                Value = config.Value,
                defaultProduct = config.defaultProduct
            });
        }

        public void RemoveItem(Config config) 
        {
            Configurables.Remove(config);
        }
    }
}