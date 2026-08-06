export default {
  tagline: "Store expensive results and return them instantly on repeat requests.",
  explanation: `
          <p>.NET offers two main in-process caching abstractions: <strong>IMemoryCache</strong> stores data in the process's memory (fast, single-server), and <strong>IDistributedCache</strong> (backed by Redis or SQL Server) shares a cache across multiple instances. Both let you set absolute and sliding expiration policies.</p>
          <p>For the common pattern of "get from cache, or compute and store if missing", <em>IMemoryCache.GetOrCreate</em> combines the lookup and write into one atomic call. The newer <em>HybridCache</em> (available from .NET 9) merges both tiers and protects against cache stampedes — multiple requests all computing the same value simultaneously because the cache just expired.</p>
        `,
  keyPoints: [
    "IMemoryCache is in-process and fast; IDistributedCache (Redis) is shared across servers",
    "GetOrCreate/GetOrCreateAsync combines lookup + set in one safe call",
    "Always set expiration — unbounded caches grow until the process runs out of memory"
  ],
  code: `using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMemoryCache();
var app = builder.Build();

app.MapGet("/weather/{city}", (string city, IMemoryCache cache) =>
{
    var result = cache.GetOrCreate($"weather:{city}", entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
        Console.WriteLine($"Cache miss — fetching {city}");
        return $"Sunny in {city}";
    });
    return result;
});

app.Run();`,
  output: `First request:  Cache miss — fetching London → "Sunny in London"
Second request: (no log, served from cache) → "Sunny in London"`,
  related: ["dependency-injection", "background-services"],
  mistakes: [
      "Caching without expiration \u2014 the cache grows unbounded until the process runs out of memory",
      "Caching user-specific data in a shared cache without scoping the key \u2014 users see each other's data",
      "Not handling cache stampedes \u2014 when many requests miss simultaneously, they all compute the expensive value at once"
  ]
};
