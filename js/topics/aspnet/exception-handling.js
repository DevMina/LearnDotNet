export default {
  difficulty: 'intermediate',
  tagline: "Middleware and ProblemDetails give your API a consistent, RFC 9457-compliant error format.",
  explanation: `
    <p>Unhandled exceptions bubble through the middleware pipeline and, by default, return a plain 500 response with no details in production. A global exception handler centralises error handling and ensures every error returns a structured <code>ProblemDetails</code> response — a standard JSON error format defined by RFC 9457.</p>
    <p><code>ProblemDetails</code> has standard fields: <code>type</code> (a URI identifying the error type), <code>title</code> (human-readable summary), <code>status</code> (HTTP status code), <code>detail</code> (error-specific detail), and <code>instance</code> (the request URI). You can add custom extensions. <code>IExceptionHandler</code> (.NET 8+) is the clean abstraction for registering exception handlers.</p>
  `,
  keyPoints: [
    'app.UseExceptionHandler() catches unhandled exceptions in the pipeline',
    'ProblemDetails is the standard JSON error response format (RFC 9457)',
    'IExceptionHandler (.NET 8+) lets you register typed exception handlers cleanly',
    'AddProblemDetails() configures the built-in ProblemDetails factory',
    'Never expose stack traces or internal exception messages in production responses',
  ],
  code: `// Program.cs — register ProblemDetails and exception handler
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

app.UseExceptionHandler();  // Must be early in the pipeline

// Typed exception handler (.NET 8+)
public class GlobalExceptionHandler(IProblemDetailsService problemDetails)
    : IExceptionHandler {

    public async ValueTask<bool> TryHandleAsync(
        HttpContext ctx, Exception ex, CancellationToken ct) {

        var (status, title) = ex switch {
            NotFoundException  => (404, "Resource not found"),
            ValidationException => (422, "Validation error"),
            UnauthorizedException => (401, "Unauthorized"),
            _                  => (500, "An unexpected error occurred")
        };

        ctx.Response.StatusCode = status;
        return await problemDetails.TryWriteAsync(new() {
            HttpContext = ctx,
            ProblemDetails = {
                Status = status,
                Title = title,
                Detail = ex.Message,
                Extensions = { ["traceId"] = ctx.TraceIdentifier }
            }
        });
    }
}`,
  output: `// Unhandled NotFoundException produces:
// HTTP 404
// {
//   "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
//   "title": "Resource not found",
//   "status": 404,
//   "detail": "Product with id 99 was not found.",
//   "traceId": "00-abc123-xyz456-00"
// }`,
  prerequisites: ['middleware', 'controllers'],
  mistakes: [
    'Returning exception.Message directly in production — it may contain internal paths or secrets',
    'Placing UseExceptionHandler() after UseRouting() — it must be early to catch all exceptions',
    'Using try/catch in every action — use a global handler and reserve try/catch for recoverable logic',
    'Not including a traceId — makes correlating logs with error reports impossible',
  ],
  related: ['middleware', 'controllers', 'model-validation', 'logging'],
  interviewQ: 'What is ProblemDetails and why should you use it for API error responses?',
  interviewA: '<code>ProblemDetails</code> is a standardised JSON error response format defined in RFC 9457. Clients can rely on a predictable shape — <code>status</code>, <code>title</code>, <code>detail</code>, <code>type</code> — rather than guessing the error format for each API. ASP.NET Core\'s <code>[ApiController]</code> already uses it for validation errors (400). Using it for all errors (404, 500, 401) creates a consistent error contract across your entire API that client teams — including your own frontend — can handle generically.',
  whyItMatters: 'Inconsistent error responses are one of the most common complaints from API consumers. A global exception handler with ProblemDetails means every error — validation failure, not found, unexpected crash — arrives in the same shape, with a trace ID that links the error to a server log.',
};
