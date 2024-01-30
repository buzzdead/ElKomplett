using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public int AdminTokens { get; set; }
        public string UserName { get; set; }
        public Address Address { get; set; }
        public BasketDto Basket { get; set; }
    }
}