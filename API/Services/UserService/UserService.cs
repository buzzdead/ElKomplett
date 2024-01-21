using API.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly StoreContext _context;
    private const string TestRole = "Test";
    private const string MemberRole = "Member";

    public UserService(UserManager<User> userManager, TokenService tokenService, IHttpContextAccessor httpContextAccessor, StoreContext context)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    public async Task<UserResult> CreateUserAsync(RegisterDto registerDto)
    {
        var user = new User { UserName = registerDto.Username, Email = registerDto.Email };
        var result = await CreateUser(user);
          if (!result.Succeeded)
        {
            return result;
        }

        if (registerDto.TestAdmin == true)
        {
            user.AdminTokens = 0;
            await _userManager.AddToRoleAsync(user, TestRole);
        }
        else
        {
            await _userManager.AddToRoleAsync(user, MemberRole);
        }

        var userResultDto = new UserResultDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user)
        };

        return new UserResult { Succeeded = true, UserResultDto = userResultDto };
    }

    public async Task<UserResult> LoginUserAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return new UserResult { Succeeded = false, ErrorMessage = "Unauthorized" };
        }

        var userBasket = await RetrieveBasket(loginDto.Username);
        var anonBasket = await RetrieveBasket(_httpContextAccessor.HttpContext.Request.Cookies["buyerId"]);

        if (anonBasket != null)
        {
            if (userBasket != null) _context.Baskets.Remove(userBasket);
            anonBasket.BuyerId = user.UserName;
            _httpContextAccessor.HttpContext.Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }

        var userDto = new UserResultDto
        {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
        };

        return new UserResult { Succeeded = true, UserResultDto = userDto };
    }
    public async Task<UserResult> CreateTestAdminAsync()
    {
        var baseName = "TestAdmin";
        var baseEmail = "Test@Admin";

        var (username, userEmail) = await GenerateUniqueUserDetailsAsync(baseName, baseEmail);

        var user = new User { UserName = username, Email = userEmail };
        var result = await CreateUser(user);

        if (!result.Succeeded)
        {
            return result;
        }

        user.AdminTokens = 0;
        await _userManager.AddToRoleAsync(user, "Test");

        var userBasket = await RetrieveBasket(user.UserName);
        var anonBasket = await RetrieveBasket(_httpContextAccessor.HttpContext.Request.Cookies["buyerId"]);

        var userDto = new UserResultDto
        {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
        };

        return new UserResult { Succeeded = true, UserResultDto = userDto };
    }
    public async Task<Basket> RetrieveBasket(string buyerId)
    {

        if (string.IsNullOrEmpty(buyerId))
        {
            _httpContextAccessor.HttpContext.Response.Cookies.Delete("buyerId");
            return null;
        }
        return await _context.Baskets
                    .Include(i => i.Items)
                    .ThenInclude(p => p.Product)
                    .ThenInclude(p => p.Images)
                    .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }
    private async Task<(string username, string email)> GenerateUniqueUserDetailsAsync(string baseName, string baseEmail)
    {
        var isUnique = false;
        var suffix = 1;
        while (!isUnique)
        {
            var duplicateUserName = await _context.Users.FirstOrDefaultAsync(u => u.UserName == baseName);
            if (duplicateUserName != null)
            {
                baseName = $"{baseName}{suffix}";
                baseEmail = $"{baseEmail}{suffix}";
                suffix++;
            }
            else
            {
                isUnique = true;
                baseEmail += ".com";
            }
        }
        return (baseName, baseEmail);
    }
    private async Task<UserResult> CreateUser(User user)
    {
        var result = await _userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            return new UserResult { Succeeded = false, Errors = result.Errors };
        }
        return new UserResult { Succeeded = true };
    }
}