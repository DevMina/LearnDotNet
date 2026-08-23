export default {
  difficulty: 'intermediate',
  versionLabel: '.NET 7+',
  tagline: "Throttle requests per client to protect your API from abuse and overload.",
  explanation: `
    <p>The built-in <code>Microsoft.AspNetCore.RateLimiting</code> middleware (.NET 7+) provides four algorithms out of the box. <strong>Fixed window</strong> allows N requests per time window (e.g. 100 per minute). <strong>Sliding window</strong> is smoother — it divides the window into segments so bursts are spread out. <strong>Token bucket</strong> allows bursts up to a bucket size, then refills at a steady rate. <strong>Concurrency</strong> limits simultaneous in-flight requests.</p>
    <p>Rate limiters can be global, per-named-policy (applied via attribute or endpoint metadata), or per-partition — meaning you can limit per IP address, per user, or per API key, each with its own independent counter.</p>
  `,
  keyPoints: [
    'UseRateLimiter() must be placed after UseRouting()',
    'Fixed window: simplest — N requests per period; vulnerable to boundary bursts',
    'Sliding window: smoother — spreads requests across sub-windows',
    'Token bucket: allows short bursts, then throttles to a steady refill rate',
    'Partition by IP, user ID, or API key to give each client its own limit',
  ],
  code: `// Program.cs
builder.Services.AddRateLimiter(options => {
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Global fixed window: 100 req/min per IP
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 5
            }));

    // Named policy: token bucket per authenticated user
    options.AddTokenBucketLimiter("ApiPolicy", opts => {
        opts.TokenLimit = 50;
        opts.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        opts.TokensPerPeriod = 10;
    });
});

app.UseRateLimiter();

// Apply named policy to endpoint
[EnableRateLimiting("ApiPolicy")]
[HttpPost("search")]
public Task<Results> Search(SearchDto dto) { ... }

// Disable rate limiting for a specific endpoint
[DisableRateLimiting]
[HttpGet("health")]
public IActionResult Health() => Ok();`,
  output: `// Under limit:  200 OK + X-RateLimit-Remaining header
// Over limit:    429 Too Many Requests
//                Retry-After: 47`,
  prerequisites: ['middleware', 'controllers'],
  mistakes: [
    'Placing UseRateLimiter() before UseRouting() — named policies cannot resolve endpoints',
    'Using a global limiter without partitioning — all clients share one counter',
    'Forgetting to set RejectionStatusCode — default is 503, not 429',
    'Not sending Retry-After headers — clients cannot back off intelligently without them',
  ],
  related: ['middleware', 'authentication', 'caching'],
  interviewQ: 'What is the difference between a fixed window and a token bucket rate limiter?',
  interviewA: 'A fixed window allows exactly N requests per window (e.g. 100 per minute) and resets the counter at the window boundary — this means a client can send 100 requests at 12:00:59 and another 100 at 12:01:00, a burst of 200 in two seconds. A token bucket fills at a steady rate (e.g. 10 tokens every 10 seconds, max 50) — clients can burst up to the bucket size but sustained throughput is capped at the refill rate. Token bucket is smoother and more appropriate when you want to allow short bursts without permitting sustained abuse.',
  whyItMatters: 'An unprotected API is one denial-of-service attack or runaway client away from being unavailable. Rate limiting is a low-effort, high-impact reliability feature that protects both your infrastructure and your other clients from the behaviour of any single caller.',
};
