

using API.Entities.ConfigAggregate;

namespace API.Entities
{
    
    public class BasketItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public long Price { get; set; }
        public string PictureUrl { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public int Quantity { get; set; }
        public int ConfigId { get; set; }
        public List<Config> Configurables { get; set; }
    }
}