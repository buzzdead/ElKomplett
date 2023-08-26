namespace API.Entities.ConfigAggregate
{
    public class Config : ImageDto
    {
        public int Id { get; set; }
        public string PublicId { get; set; }
        public long Price { get; set; }
        public int QuantityInStock { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public string PictureUrl { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; }

    }
}