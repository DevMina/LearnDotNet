export default {
  tagline: "Measure first, then apply the right tool — most performance gains come from a handful of patterns.",
  explanation: `
          <p>Performance in .NET nearly always starts with <strong>measurement</strong>: BenchmarkDotNet for micro-benchmarks, dotnet-trace or Visual Studio's profiler for application-level profiling. Guessing without data wastes effort and risks making things worse.</p>
          <p>The highest-leverage patterns: avoid allocations in hot paths (use <em>Span&lt;T&gt;</em>, <em>ArrayPool&lt;T&gt;</em>, <em>StringBuilder</em>); prefer <em>async/await</em> for I/O so threads aren't blocked; use <em>Parallel.ForEach</em> or PLINQ only for CPU-bound work; avoid <em>async void</em>, unnecessary <em>Task.Result</em>, and <em>Thread.Sleep</em>; and keep LINQ chains over large sets out of hot paths — they allocate enumerators and delegates. <em>ValueTask</em> instead of <em>Task</em> avoids allocations when a result is often available synchronously.</p>
        `,
  keyPoints: [
    "Profile before optimising — BenchmarkDotNet and dotnet-trace show where time actually goes",
    "Reduce allocations in hot paths: Span<T>, ArrayPool, StringBuilder, struct-based types",
    "Async/await for I/O; Parallel.For for CPU-bound work; never block an async call with .Result"
  ],
  code: `using System.Buffers;
using System.Text;

// Avoid: creates a new string on every call in a tight loop
string SlowJoin(IEnumerable<string> items) =>
    string.Join(",", items.Select(x => x.ToUpper()));

// Better: StringBuilder avoids intermediate string allocations
string FastJoin(IEnumerable<string> items)
{
    var sb = new StringBuilder();
    foreach (var item in items)
    {
        if (sb.Length > 0) sb.Append(',');
        sb.Append(item.AsSpan().ToString().ToUpper());
    }
    return sb.ToString();
}

Console.WriteLine(FastJoin(new[] { "alpha", "beta", "gamma" }));`,
  output: `ALPHA,BETA,GAMMA`,
  related: ["memory-management", "linq", "async-await"],
  mistakes: [
      "Optimising before profiling \u2014 the bottleneck is almost never where you think it is",
      "Blocking async code with .Result or .Wait() \u2014 deadlocks in ASP.NET and wastes a thread everywhere else",
      "Using string concatenation in a loop \u2014 use StringBuilder or string.Join; each + creates a new string object"
  ]
};
