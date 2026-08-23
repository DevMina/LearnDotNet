export default {
  tagline: "Structured, levelled, provider-agnostic logging built into the framework.",
  explanation: `
          <p>ASP.NET Core ships with a built-in <strong>ILogger&lt;T&gt;</strong> abstraction that works with multiple providers (console, debug, EventSource, third-party like Serilog or NLog) without your code ever knowing which one is active. Inject <em>ILogger&lt;MyClass&gt;</em> into a constructor and call <em>Log.Information</em>, <em>Log.Warning</em>, <em>Log.Error</em>, etc.</p>
          <p>Prefer <strong>structured logging</strong> over string interpolation: use message templates with named placeholders (<em>"Processed {Count} items"</em>). Providers that support structured data (Seq, Application Insights, Elastic) store these as queryable fields rather than raw strings, making logs far easier to search and aggregate in production.</p>
        `,
  keyPoints: [
    "ILogger<T> is the standard abstraction — inject it, never construct a logger directly",
    "Use message templates (\"User {Id} logged in\"), not string interpolation, for structured logging",
    "Log levels (Trace, Debug, Info, Warning, Error, Critical) are filterable per category in config"
  ],
  code: `public class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
        => _logger = logger;

    public void Process(int orderId)
    {
        _logger.LogInformation("Processing order {OrderId}", orderId);
        try
        {
            // ...
            _logger.LogInformation("Order {OrderId} completed", orderId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process order {OrderId}", orderId);
        }
    }
}`,
  output: `info: OrderService[0]
      Processing order 42
info: OrderService[0]
      Order 42 completed`,
  related: ["dependency-injection", "configuration"],
  mistakes: [
      "Using string interpolation instead of message templates \u2014 loses structured data and causes unnecessary allocations",
      "Logging at the wrong level \u2014 Debug in production floods logs; Error for expected business events adds noise",
      "Not including a correlation ID \u2014 makes it impossible to trace a single request across log lines"
  ],

  difficulty: 'intermediate',

  whyItMatters: `Structured logging (key-value pairs rather than concatenated strings) makes logs queryable in tools like Seq, Elasticsearch, or Azure Monitor. Using <code>ILogger&lt;T&gt;</code> rather than a static logger keeps your classes testable and lets the host control log output at runtime.`,

  prerequisites: ["dependency-injection","top-level-statements"],
  interviewQ: `What is structured logging and why is it preferred over string concatenation?`,
  interviewA: `Structured logging stores log data as key-value pairs rather than as a formatted string. <code>logger.LogInformation("User {UserId} logged in from {IP}", userId, ip)</code> stores <code>UserId=42</code> and <code>IP=1.2.3.4</code> as searchable properties — not embedded in a string. Log aggregators (Seq, Splunk, Elastic) can then query <code>UserId = 42</code> across millions of log entries in milliseconds. String concatenation (<code>"User " + userId + " logged in"</code>) is unqueryable — you can only do full-text search. Structured logging also avoids the allocation of formatting the string when the log level is disabled.`
};
