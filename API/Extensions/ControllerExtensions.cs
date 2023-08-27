using API.Controllers;

public static class ControllerExtensions
{
    public static async Task<ImageAdder> AddImagesAsync(this BaseApiController controller, List<IFormFile> files, ImageAdder imageAdder, ImageService imageService)
    {
        foreach (var file in files)
        {
            if (file != null)
            {
                var imageResult = await imageService.AddImageAsync(file);

                if (imageResult.Error != null)
                {
                    controller.ModelState.AddModelError("file", imageResult.Error.Message);
                }
                else
                {
                    imageAdder.AddImage(new Image { PictureUrl = imageResult.SecureUrl.ToString(), PublicId = imageResult.PublicId, Name = file.FileName });
                }
            }
        }
        if (imageAdder.Images.Count == 0)
        {
            imageAdder.AddImage(new Image { PictureUrl = "/images/products/sb-ang1.png", PublicId = "0" });
        }
        return imageAdder;
    }
    public static Task<Sortable> SortImagesPre(this BaseApiController controller, Sortable sortable)
    {
        Dictionary<string, int> imageOrder = new();
        for (int i = 0; i < sortable.Order.Count; i++)
        {
            imageOrder[sortable.Order[i]] = i;
        }

        sortable.Files.Sort((file1, file2) =>
        {
            int order1 = imageOrder.TryGetValue(file1.FileName, out int o1) ? o1 : int.MaxValue;
            int order2 = imageOrder.TryGetValue(file2.FileName, out int o2) ? o2 : int.MaxValue;
            return order1.CompareTo(order2);
        });
        return Task.FromResult(sortable);
    }
    public static Task<ImageAdder> SortImagesPost(this BaseApiController controller, ImageAdder imageAdder, Sortable sortable)
    {
        Dictionary<string, int> imageOrder = new();
        for (int i = 0; i < sortable.Order.Count; i++)
        {
            imageOrder[sortable.Order[i]] = i;
        }
        imageAdder.Images.Sort((file1, file2) =>
            {
                int order1 = imageOrder.TryGetValue(file1.PublicId, out int o1) ? o1 : imageOrder.TryGetValue(file1.Name, out int o2) ? o2 : int.MaxValue;
                int order2 = imageOrder.TryGetValue(file2.PublicId, out int o3) ? o3 : imageOrder.TryGetValue(file2.Name, out int o4) ? o4 : int.MaxValue;
                return order1.CompareTo(order2);
            });
        for (int i = 0; i < imageAdder.Images.Count; i++) imageAdder.Images[i].Order = i;
        return Task.FromResult(imageAdder);
    }
    public static async Task<bool> TestAdminRequest(User user, UserManager<User> userManager)
    {
        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains("Test"))
        {
            user.AdminTokens += 1;
            return user.AdminTokens <= 100;
        }
        return true;

    }
}