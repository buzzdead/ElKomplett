namespace API.DTOs
{
    public class RegisterDto : LoginDto
    {
        public string Email { get; set; }
        public bool? TestAdmin { get; set; }
    }
}