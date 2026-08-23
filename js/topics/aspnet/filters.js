export default {
  difficulty: 'intermediate',
  tagline: "Run logic before or after action methods without cluttering the methods themselves.",
  explanation: `
    <p>Filters are a pipeline within the MVC/Minimal API layer, running only for requests that reach an action. They are distinct from middleware: middleware operates on raw <code>HttpContext</code> for all requests; filters operate on action-level context and have access to model state, action arguments, and action results.</p>
    <p>Filter types run in order: <strong>Authorization</strong> → <strong>Resource</strong> → <strong>Action</strong> → <strong>Result</strong> / <strong>Exception</strong>. Action filters run both before and after the action method. Exception filters catch unhandled exceptions from the action (prefer global exception handler for broad coverage). Result filters run after the action result is produced but before it is executed (useful for adding response headers).</p>
  `,
  keyPoints: [
    'IActionFilter: OnActionExecuting (before) and OnActionExecuted (after) the action method',
    'IResultFilter: runs after the action result is produced, before it is written to the response',
    'IExceptionFilter: catches unhandled exceptions from the action — prefer IExceptionHandler globally',
    'Filters can be applied per-action, per-controller, or globally via MvcOptions',
    'Async filters: IAsyncActionFilter has a single InvokeAsync method wrapping the next delegate',
  ],
  code: `// Action filter — log timing for any decorated action
public class TimingFilter : IActionFilter {
    private Stopwatch? _sw;

    public void OnActionExecuting(ActionExecutingContext ctx) {
        _sw = Stopwatch.StartNew();
    }

    public void OnActionExecuted(ActionExecutedContext ctx) {
        _sw?.Stop();
        var logger = ctx.HttpContext.RequestServices
            .GetRequiredService<ILogger<TimingFilter>>();
        logger.LogInformation("{Action} took {Ms}ms",
            ctx.ActionDescriptor.DisplayName, _sw?.ElapsedMilliseconds);
    }
}

// Apply per action
[TypeFilter(typeof(TimingFilter))]
[HttpGet("slow")]
public async Task<string> SlowEndpoint() { ... }

// Apply globally in Program.cs
builder.Services.AddControllers(options =>
    options.Filters.Add<TimingFilter>());

// Async action filter pattern
public class ValidateModelFilter : IAsyncActionFilter {
    public async Task OnActionExecutionAsync(
        ActionExecutingContext ctx, ActionExecutionDelegate next) {
        if (!ctx.ModelState.IsValid) {
            ctx.Result = new UnprocessableEntityObjectResult(ctx.ModelState);
            return; // Short-circuits — action never runs
        }
        await next(); // Run the action
    }
}`,
  output: `// GET /slow
// → action runs
// → log: "SlowEndpoint took 142ms"
// → 200 OK response`,
  prerequisites: ['controllers', 'middleware'],
  mistakes: [
    'Using filters for cross-cutting concerns that apply to all requests — middleware is the right place',
    'Registering DI-dependent filters with [ServiceFilter] instead of [TypeFilter] — TypeFilter creates a new instance per request',
    'Catching exceptions in IExceptionFilter instead of IExceptionHandler — the global handler covers more of the pipeline',
    'Forgetting that filter order matters: authorization runs before resource, which runs before action',
  ],
  related: ['middleware', 'controllers', 'exception-handling'],
  interviewQ: 'What is the difference between a filter and middleware in ASP.NET Core?',
  interviewA: 'Middleware runs for every HTTP request in the pipeline — even static files, health checks, and requests that never reach a controller. Filters run only within the MVC layer, for requests that match a route and reach an action method. Filters have richer context: they know the action name, arguments, model state, and action result. Use middleware for authentication, CORS, logging, rate limiting. Use filters for action-specific concerns: timing a specific controller, adding response headers for MVC results, or logging action arguments.',
  whyItMatters: 'Filters let you attach cross-cutting behaviour to specific controllers or actions without duplicating code or polluting action methods with unrelated logic. They are how attribute-based frameworks like ASP.NET Core implement declarative validation, caching, and authorisation policies cleanly.',
};
