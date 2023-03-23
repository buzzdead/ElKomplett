using Microsoft.AspNetCore.Mvc.Controllers;

public class AuthorizationMiddleware
{
    private readonly RequestDelegate _next;

    public AuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, UserManager<User> userManager)
    {
        var endpoint = context.GetEndpoint();

        if (endpoint != null)
        {
            var controllerActionDescriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
            if (controllerActionDescriptor != null)
            {
                var authorizeAttribute = controllerActionDescriptor.EndpointMetadata
                    .OfType<AuthorizeAttribute>()
                    .FirstOrDefault();

                if (authorizeAttribute != null)
                {
                    var user = await userManager.FindByNameAsync(context.User.Identity.Name);
                    var hasToken = await ControllerExtensions.TestAdminRequest(user, userManager);

                    if (!hasToken)
                    {
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsync("Admin access has expired, try again later.");
                        return;
                    }
                }
            }
        }

        await _next(context);
    }
}
