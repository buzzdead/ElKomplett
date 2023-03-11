using API.Controllers;

public static class ControllerExtensions
{
    public static async Task<ImageDto> AddImageAsync(this BaseApiController controller, IFormFile file, ImageDto imageDto, ImageService imageService)
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
                if (!string.IsNullOrEmpty(imageDto.PublicId) && imageDto.PublicId != "0")
                    await imageService.DeleteImageAsync(imageDto.PublicId);
                imageDto.PictureUrl = imageResult.SecureUrl.ToString();
                imageDto.PublicId = imageResult.PublicId;
            }
        }
        else {
            imageDto.PictureUrl = "/images/products/sb-ang1.png";
            imageDto.PublicId = "0";
        }
        return imageDto;
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