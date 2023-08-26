namespace API.Entities
{
    public class Image : ImageDto
    {
        public int Id { get; set; }
        public string PictureUrl { get; set; }
        public string PublicId { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
    }
}