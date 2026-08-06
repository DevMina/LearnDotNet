export default {
  tagline: "Run long-lived work alongside your app without blocking requests.",
  explanation: `
          <p>A <strong>hosted service</strong> in ASP.NET Core implements <em>IHostedService</em> (or inherits <em>BackgroundService</em>) and runs for the lifetime of the application — started when the host starts, stopped gracefully when it shuts down. Common uses include polling external APIs, processing a message queue, sending scheduled emails, or cleaning up old records.</p>
          <p><em>BackgroundService</em> is the abstract base class that wraps <em>IHostedService</em> in a simpler API: you override <em>ExecuteAsync</em>, loop inside it (using the provided <em>CancellationToken</em> to detect shutdown), and the framework handles start/stop for you. Register it with <em>AddHostedService&lt;T&gt;</em>.</p>
        `,
  keyPoints: [
    "BackgroundService.ExecuteAsync runs for the app's lifetime — loop and await inside it",
    "Always respect the CancellationToken so the service shuts down cleanly",
    "Register with builder.Services.AddHostedService<MyService>()"
  ],
  code: `public class HeartbeatService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Service alive");
            await Task.Delay(TimeSpan.FromSeconds(5), ct);
        }
    }
}

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHostedService<HeartbeatService>();
var app = builder.Build();
app.Run();`,
  output: `[10:00:00] Service alive
[10:00:05] Service alive
[10:00:10] Service alive`,
  related: ["async-await", "cancellation-token", "dependency-injection"],
  mistakes: [
      "Not handling exceptions inside ExecuteAsync \u2014 an unhandled exception stops the service silently",
      "Ignoring the CancellationToken \u2014 the service won't shut down cleanly when the host stops",
      "Resolving scoped services directly from the constructor \u2014 inject IServiceScopeFactory and create a scope per work item"
  ]
};
