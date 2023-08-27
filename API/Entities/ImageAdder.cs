public interface ImageAdder
{
    public List<Image> Images { get; set; }
    public void AddImage(Image imageDto)
        {
            Images.Add(imageDto);
        }
}