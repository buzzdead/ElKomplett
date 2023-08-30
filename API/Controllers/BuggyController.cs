using System.Net;
using System.Net.Mail;
using API.Entities;
using API.Entities.ConfigAggregate;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly IConfiguration _config;
        private readonly StoreContext _context;
        public BuggyController(IConfiguration config, StoreContext context)
        {
            _config = config;
            _context = context;
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
        public async Task<ActionResult<ContactMessage>> SendMessage([FromForm] ContactFormDataDto formData)
        {
            var contactMessage = new ContactMessage{Name = formData.Name, Email = formData.Email, Message = formData.Message};

             _context.ContactMessages.Add(contactMessage);

             var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(contactMessage);

            return BadRequest(new ProblemDetails { Title = "Problem adding contact message" });

        }

        [HttpDelete]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);

            if(contactMessage == null) return NotFound();
            _context.ContactMessages.Remove(contactMessage);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem deleting contact message");
        }
        [HttpGet("Messages")]
        public async Task<ActionResult<List<ContactMessage>>> GetMessages()
        {
            var messages = await _context.ContactMessages.ToListAsync();
            return messages;
        }

    }
}