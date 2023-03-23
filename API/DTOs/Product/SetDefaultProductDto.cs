namespace API.DTOs.Product
{
    public class SetDefaultProductDto
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public int QuantityInStock { get; set; }
        public string PictureUrl { get; set; }
        
    }
}