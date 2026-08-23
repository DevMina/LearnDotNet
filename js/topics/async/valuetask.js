export default {
  difficulty: 'advanced',
  versionLabel: '.NET Core 2.1+',
  tagline: "A value-type Task that avoids heap allocation when the result is already available.",
  explanation: `
    <p><code>Task&lt;T&gt;</code> is a class — every async method that returns one allocates a Task object on the heap, even if the result was available synchronously (e.g. from a cache). <code>ValueTask&lt;T&gt;</code> is a struct that wraps either a result (no allocation) or a real <code>Task</code> (one allocation, same as before). When the path is synchronous, it returns with zero heap allocation.</p>
    <p>The trade-off: <code>ValueTask</code> has strict usage rules. It must be awaited exactly once, cannot be awaited multiple times, and should not be stored and awaited later. Violating these rules causes undefined behaviour. It also adds slightly more complexity to read. Use it only where profiling shows allocation pressure in a hot async path.</p>
  `,
  keyPoints: [
    'ValueTask<T> avoids heap allocation when the result is synchronously available',
    'Must be awaited exactly once — never cache and re-await a ValueTask',
    'IValueTaskSource<T> allows advanced pooling scenarios (used internally by .NET)',
    'Default choice remains Task<T> — reach for ValueTask only after profiling',
    'ValueTask (non-generic) exists for async void equivalents with less overhead',
  ],
  code: `// Simple cache example — synchronous path is alloc-free
class DataService {
    private readonly Dictionary<int, string> _cache = new();

    public async ValueTask<string> GetAsync(int id) {
        // Synchronous path: no Task allocation
        if (_cache.TryGetValue(id, out var cached))
            return cached;

        // Async path: falls back to a real Task under the hood
        var result = await FetchFromDbAsync(id);
        _cache[id] = result;
        return result;
    }

    private Task<string> FetchFromDbAsync(int id) =>
        Task.FromResult($"Record #{id}");
}

// Usage
var svc = new DataService();
string first  = await svc.GetAsync(1); // async — hits DB
string second = await svc.GetAsync(1); // sync  — cache hit, no Task alloc
Console.WriteLine(second);

// WRONG — do not re-await a ValueTask
var vt = svc.GetAsync(2);
await vt;
// await vt; ← undefined behaviour`,
  output: `Record #1`,
  prerequisites: ['async-await', 'memory-management'],
  mistakes: [
    'Awaiting a ValueTask more than once — undefined behaviour, may return wrong results',
    'Storing a ValueTask in a field and awaiting it later — not safe',
    'Using ValueTask everywhere by default — the overhead of the check outweighs gains except in hot paths',
    'Returning ValueTask from public library APIs — forces callers into the strict rules',
  ],
  related: ['async-await', 'performance-tips', 'async-streams'],
  interviewQ: 'When should you return <code>ValueTask&lt;T&gt;</code> instead of <code>Task&lt;T&gt;</code>?',
  interviewA: 'When profiling shows significant allocation pressure from async methods that frequently complete synchronously — e.g. a cache-backed service where 95% of calls return a cached result without hitting I/O. <code>ValueTask</code> avoids the heap-allocated <code>Task</code> object on the synchronous path. Do not use it by default: it adds complexity (strict single-await rule), can hurt performance on the async path, and surprises callers who try to re-await or store the result.',
  whyItMatters: 'The .NET runtime itself uses ValueTask extensively in I/O pipelines where millions of async calls per second make allocation pressure measurable. Understanding ValueTask positions you to write library code at the same performance tier as the BCL.',
};
