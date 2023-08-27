namespace API.Entities.ConfigAggregate
{
    public class Config : ImageAdder
    {
        public int Id { get; set; }
        public long Price { get; set; }
        public int QuantityInStock { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public List<Image> Images { get; set; } = new();
        public int ProductId { get; set; }
        public string Name { get; set; }

    }
}