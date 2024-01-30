using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ChangeUserDetailsDto
    {
        public string Email { get; set; }
        public string UserName { get; set; }
    }
}