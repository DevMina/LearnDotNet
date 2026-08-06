export default {
  tagline: "Build HTTP endpoints with almost no ceremony — no controllers, no attributes.",
  explanation: `
          <p><strong>Minimal APIs</strong>, introduced in .NET 6, let you define HTTP endpoints directly in <em>Program.cs</em> using <em>MapGet</em>, <em>MapPost</em>, <em>MapPut</em>, and <em>MapDelete</em> — no controller classes or action-method attributes required. The route handler is just a lambda or a named method, and ASP.NET Core automatically binds parameters from the route, query string, or request body.</p>
          <p>Route groups (<em>app.MapGroup</em>) let you add a common prefix and shared middleware to a set of endpoints. For larger apps, handler methods can be organized into separate files using extension methods on <em>WebApplication</em> — keeping the conciseness without forcing everything into one file.</p>
        `,
  keyPoints: [
    "MapGet/MapPost/MapPut/MapDelete register endpoints with zero boilerplate",
    "Parameters are automatically bound from route, query string, or JSON body",
    "MapGroup adds a shared prefix and middleware to a set of related endpoints"
  ],
  code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<List<string>>(_ => new() { "Alice", "Bob" });

var app = builder.Build();

app.MapGet("/users", (List<string> users) => users);

app.MapPost("/users", (string name, List<string> users) =>
{
    users.Add(name);
    return Results.Created($"/users/{name}", name);
});

app.Run();`,
  output: `GET  /users       → ["Alice","Bob"]
POST /users?name=Carol → 201 Created`,
  related: ["middleware", "dependency-injection", "json-serialization"],
  mistakes: [
      "Returning raw objects instead of Results.Ok/Results.NotFound \u2014 loses HTTP status code control",
      "Putting business logic directly in the lambda handler \u2014 keep handlers thin, delegate to services",
      "Forgetting to add required services (e.g. AddAuthentication) before using the related middleware"
  ]
};
