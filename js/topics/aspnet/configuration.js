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
  ],

  difficulty: 'intermediate',

  whyItMatters: `The configuration system lets you separate code from environment-specific settings — connection strings, API keys, feature flags — and override them at deployment time without rebuilding. Understanding the layered provider model means you know exactly which source wins when values conflict.`,

  prerequisites: ["top-level-statements"],
  interviewQ: `In which order do ASP.NET Core configuration providers override each other?`,
  interviewA: `Later providers override earlier ones. The default order in <code>WebApplication.CreateBuilder</code> is: (1) appsettings.json, (2) appsettings.{Environment}.json, (3) User Secrets (Development only), (4) environment variables, (5) command-line arguments. So an environment variable overrides appsettings.json, and a command-line argument overrides everything. You can add custom providers anywhere in the chain. This means you can safely store production secrets in environment variables or a secrets manager, knowing they will override the checked-in defaults.`
};
