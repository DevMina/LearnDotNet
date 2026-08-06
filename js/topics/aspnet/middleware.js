export default {
  tagline: "Chain request-handling components, each deciding whether to pass control forward.",
  explanation: `
          <p>In ASP.NET Core, every HTTP request passes through a <strong>middleware pipeline</strong> — an ordered chain of components, each of which can inspect the request, do work, call the next component, and then do more work on the way back out. You compose the pipeline in <em>Program.cs</em> using <em>app.Use</em>, <em>app.Run</em>, and <em>app.Map</em>.</p>
          <p><em>app.Use</em> adds a middleware that calls <em>next()</em> to continue the chain. <em>app.Run</em> is a terminal middleware — it ends the pipeline there. Order matters: a middleware registered before another wraps it completely, so authentication must come before authorization, and routing before endpoint execution.</p>
        `,
  keyPoints: [
    "Each middleware calls await next(context) to pass to the next component",
    "app.Use adds pass-through middleware; app.Run adds a terminal one",
    "Order is critical — auth, routing, and endpoint middleware must be in the right sequence"
  ],
  code: `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.Use(async (context, next) =>
{
    Console.WriteLine($"Before: {context.Request.Path}");
    await next(context);
    Console.WriteLine($"After: {context.Response.StatusCode}");
});

app.MapGet("/", () => "Hello!");
app.Run();`,
  output: `Before: /
After: 200`,
  related: ["dependency-injection", "minimal-apis"],
  mistakes: [
      "Not calling await next(context) \u2014 the rest of the pipeline is silently skipped",
      "Adding middleware in the wrong order \u2014 authentication must precede authorization, routing must precede endpoints",
      "Writing expensive synchronous work in middleware \u2014 blocks the request thread; use async throughout"
  ]
};
