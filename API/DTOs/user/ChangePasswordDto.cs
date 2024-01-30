using System.ComponentModel.DataAnnotations;

namespace ElKomplett.API.DTOs.User
{
    public class ChangePasswordDto
    {
        [Required]
        public string Password { get; set; }

        [Required]
        public string Oldpassword { get; set; }
    }
}
