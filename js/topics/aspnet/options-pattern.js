export default {
  tagline: "Bind configuration to strongly-typed classes and inject them anywhere.",
  explanation: `
          <p>The <strong>Options Pattern</strong> wraps the raw <em>IConfiguration</em> API in a DI-friendly, strongly-typed layer. You define a plain class (no attributes, no base class), register it with <em>services.Configure&lt;MyOptions&gt;(config.GetSection("MySection"))</em>, then inject <em>IOptions&lt;MyOptions&gt;</em> where you need it.</p>
          <p>Three interfaces give different behaviours: <em>IOptions&lt;T&gt;</em> is a singleton — values are read once; <em>IOptionsSnapshot&lt;T&gt;</em> re-reads per request (scoped); <em>IOptionsMonitor&lt;T&gt;</em> re-reads in real-time and fires a callback when config changes. <em>AddOptions&lt;T&gt;().ValidateDataAnnotations()</em> adds startup validation so a missing required field fails fast, before any request hits your code.</p>
        `,
  keyPoints: [
    "IOptions<T> is singleton; IOptionsSnapshot<T> is per-request; IOptionsMonitor<T> is live-updating",
    "ValidateDataAnnotations() fails fast at startup if required config is missing",
    "Keep option classes simple POCOs — no DI, no logic, just properties"
  ],
  code: `public class SmtpOptions
{
    [Required] public string Host { get; set; } = "";
    public int Port { get; set; } = 587;
}

var builder = WebApplication.CreateBuilder(args);
builder.Services
    .AddOptions<SmtpOptions>()
    .Bind(builder.Configuration.GetSection("Smtp"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

var app = builder.Build();
app.MapGet("/smtp", (IOptions<SmtpOptions> opts) =>
    $"{opts.Value.Host}:{opts.Value.Port}");
app.Run();`,
  output: `smtp.example.com:587`,
  related: ["configuration", "dependency-injection"],
  mistakes: [
      "Injecting IConfiguration directly instead of IOptions<T> \u2014 skips validation and type safety",
      "Using IOptions<T> when you need live updates \u2014 it's a singleton; use IOptionsMonitor<T> for live reload",
      "Not calling ValidateOnStart \u2014 misconfiguration is only discovered when the option is first accessed, not at startup"
  ],

  difficulty: 'intermediate',

  whyItMatters: `The Options pattern gives you strongly-typed access to configuration sections — autocomplete, validation at startup, and no magic strings. It also supports reloading options at runtime without restarting the application, which is critical for feature flags and connection string rotation.`,

  prerequisites: ["configuration","dependency-injection"],
  interviewQ: `What is the difference between <code>IOptions&lt;T&gt;</code>, <code>IOptionsSnapshot&lt;T&gt;</code>, and <code>IOptionsMonitor&lt;T&gt;</code>?`,
  interviewA: `<code>IOptions&lt;T&gt;</code>: singleton — reads configuration once at startup; does not reflect changes made to appsettings.json at runtime. <code>IOptionsSnapshot&lt;T&gt;</code>: scoped — re-reads configuration once per request; reflects changes between requests; cannot be injected into singletons. <code>IOptionsMonitor&lt;T&gt;</code>: singleton — always returns the current value and exposes an <code>OnChange</code> callback for reacting to live changes; the right choice for singletons that need live reload (e.g. a singleton cache whose TTL is configurable).`
};
