public class UserResult
{
    public bool Succeeded { get; set; }
    public IEnumerable<IdentityError> Errors { get; set; }
    public UserResultDto UserResultDto { get; set; }
    public string ErrorMessage { get; set; }
}