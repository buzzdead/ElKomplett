namespace API.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string PictureUrl { get; set; }
        public int? ParentCategoryId { get; set; }
    
        public List<Category> ChildCategories { get; set; } = new();
    }
}