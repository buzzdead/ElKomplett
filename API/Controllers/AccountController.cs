using System.Configuration;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private TokenService _tokenService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;
        private readonly UserService _userService;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context, IConfiguration config, UserService userService)
        {
            _context = context;
            _config = config;
            _tokenService = tokenService;
            _userManager = userManager;
            _userService = userService;

        }

        [HttpDelete("deleteUser")]
        public async Task<ActionResult> DeleteUser(string userName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == userName);
            if (user == null) return BadRequest();
            _context.Users.Remove(user);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting producer" });
        }

        [HttpPost("google")]
        public async Task<ActionResult<UserDto>> Google(GoogleTokenRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var idToken = request.Token;
            JwtSecurityToken jwtToken;
            var googleId = _config["googleId"];

            try
            {
                var httpClient = new HttpClient();
                var json = await httpClient.GetStringAsync("https://www.googleapis.com/oauth2/v3/certs");
                var jsonObject = JObject.Parse(json);
                var keysArray = jsonObject["keys"].ToString();

                var signingKeys = Newtonsoft.Json.JsonConvert.DeserializeObject<List<JsonWebKey>>(keysArray);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKeys = signingKeys,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = "https://accounts.google.com",
                    ValidAudience = googleId,
                    ValidAlgorithms = new[] { SecurityAlgorithms.RsaSha256 },
                };

                jwtToken = tokenHandler.ReadJwtToken(idToken);
                tokenHandler.ValidateToken(idToken, validationParameters, out var validatedToken);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
                return Unauthorized();
            }

            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;
            var name = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                var isUnique = false;
                var baseName = name;
                var suffix = 1;
                while (!isUnique)
                {
                    var duplicateUserName = await _context.Users.FirstOrDefaultAsync(u => u.UserName == name);
                    if (duplicateUserName != null)
                    {
                        name = $"{baseName}{suffix++}";
                    }
                    else
                    {
                        isUnique = true;
                    }
                }

                user = new User { UserName = name, Email = email };
                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest("User creation failed");
                }
            }

            var userBasket = await _userService.RetrieveBasket(user.UserName);
            var anonBasket = await _userService.RetrieveBasket(Request.Cookies["buyerId"]);
            var userDto = new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };

            return userDto;
        }

        [HttpGet("createTestAdmin")]
        public async Task<ActionResult<UserDto>> CreateTestAdmin()
        {
            var result = await _userService.CreateTestAdminAsync();

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            return result.UserResultDto;
        }

        [HttpPost("login")]

        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
             var result = await _userService.LoginUserAsync(loginDto);

        if (!result.Succeeded)
        {
            return Unauthorized(result.ErrorMessage);
        }

        return result.UserResultDto;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var result = await _userService.CreateUserAsync(registerDto);

        if (!result.Succeeded)
        {
            return HandleError(result.Errors);
        }

        return StatusCode(201);
        }
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var roles = await _userManager.GetRolesAsync(user);

            var userBasket = await _userService.RetrieveBasket(User.Identity.Name);


            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto(),
            };
        }
        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        
        private ActionResult HandleError(IEnumerable<IdentityError> errors)
    {
        foreach (var error in errors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }
        return ValidationProblem();
    }
    }
}