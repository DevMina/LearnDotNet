export default {
  tagline: "Read settings from JSON, environment variables, and secrets — in priority order.",
  explanation: `
          <p>ASP.NET Core's configuration system layers multiple <strong>providers</strong> on top of each other: <em>appsettings.json</em>, <em>appsettings.{Environment}.json</em>, environment variables, command-line arguments, and (in development) User Secrets. Later providers win, so an environment variable always overrides a JSON file value.</p>
          <p>Access individual values with <em>IConfiguration["Key"]</em>, or bind an entire section to a strongly-typed class with <em>GetSection("MySection").Get&lt;MyOptions&gt;()</em> — which pairs naturally with the Options Pattern for validation and DI-friendly access. Never hardcode connection strings or secrets — use environment variables or a secrets manager instead.</p>
        `,
  keyPoints: [
    "Providers layer in priority order — env vars override appsettings.json by default",
    "GetSection(\"Name\").Get<T>() binds a config section to a strongly-typed POCO",
    "Use dotnet user-secrets in development; never commit secrets to source control"
  ],
  code: `// appsettings.json:
// { "App": { "Name": "LearnDotNet", "MaxItems": 50 } }

public class AppOptions
{
    public string Name { get; set; } = "";
    public int MaxItems { get; set; }
}

var builder = WebApplication.CreateBuilder(args);
var opts = builder.Configuration
    .GetSection("App")
    .Get<AppOptions>()!;

Console.WriteLine($"{opts.Name}: max {opts.MaxItems} items");`,
  output: `LearnDotNet: max 50 items`,
  related: ["options-pattern", "dependency-injection"],
  mistakes: [
      "Committing secrets to source control \u2014 use environment variables, User Secrets, or a secrets manager",
      "Reading IConfiguration directly in business logic \u2014 bind to a typed options class instead",
      "Forgetting that environment variable names use __ (double underscore) as the section separator, not :"
  ]
};
