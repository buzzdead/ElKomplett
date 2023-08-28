using System.Net;
using System.Net.Mail;
using API.Entities.ConfigAggregate;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly IConfiguration _config;
        public BuggyController(IConfiguration config)
        {
            _config = config;
        }
        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ProblemDetails { Title = "This is a bad request" });
        }

        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorised()
        {
            return Unauthorized();
        }

        [HttpGet("validation-error")]
        public ActionResult GetValidationError()
        {
            ModelState.AddModelError("Problem 1", "This is the first error");
            ModelState.AddModelError("Problem 2", "This is the second error");
            return ValidationProblem();
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            throw new System.Exception("This is a server error");
        }
        [HttpPost]
        public IActionResult SendMessage([FromForm] ContactFormDataDto formData)
        {
            var emailAddress =  _config["Email:Address"];
            var emailPassword = _config["Email:Password"];
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(emailAddress, emailPassword),
            };

            // Construct the email
            var mailMessage = new MailMessage
            {
                From = new MailAddress(formData.Email),
                Subject = "Message from Contact Form",
                Body = $"Name: {formData.Name}\nEmail: {formData.Email}\nMessage: {formData.Message}",
            };

            mailMessage.To.Add(emailAddress); // Your email address

            // Send the email
            try
            {
                smtpClient.Send(mailMessage);
                return Ok("Message sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while sending the message.");
            }

        }

    }
}