public interface IUserService
{
    Task<UserResult> CreateUserAsync(RegisterDto registerDto);
    Task<UserResult> LoginUserAsync(LoginDto loginDto);
    Task<Basket> RetrieveBasket(string username);
    // Add other method signatures here as needed
}