export default {
  tagline: "Understand the GC, the stack vs heap, and how to avoid common leaks.",
  explanation: `
          <p>.NET uses a <strong>generational garbage collector</strong> that automatically reclaims heap memory. Objects are born in <strong>Generation 0</strong>; those that survive a collection are promoted to Gen 1, then Gen 2. Short-lived objects (most objects) are collected cheaply in Gen 0. Long-lived objects (caches, singletons) sit in Gen 2 and are collected rarely — if they grow unbounded, that's a memory leak even under GC.</p>
          <p>Value types (structs, primitives) live on the <strong>stack</strong> (or inline in an array) and require no GC at all — they're simply popped when the method returns. <em>Span&lt;T&gt;</em> and <em>ArrayPool&lt;T&gt;</em> are key tools for reducing heap allocations in hot paths. For anything that wraps an unmanaged resource (file handles, sockets), implement <em>IDisposable</em> and use a <em>using</em> statement — the GC does not call <em>Dispose</em> for you.</p>
        `,
  keyPoints: [
    "GC is generational — Gen 0 is cheap; large or long-lived objects in Gen 2 are expensive to collect",
    "IDisposable/using is mandatory for unmanaged resources — the GC won't call Dispose",
    "Span<T> and ArrayPool<T> reduce allocations and GC pressure in performance-critical paths"
  ],
  code: `// IDisposable pattern for unmanaged resources
public class FileProcessor : IDisposable
{
    private readonly FileStream _stream;
    private bool _disposed;

    public FileProcessor(string path)
        => _stream = File.OpenRead(path);

    public long Length => _stream.Length;

    public void Dispose()
    {
        if (_disposed) return;
        _stream.Dispose();
        _disposed = true;
    }
}

// Always use 'using' — even if an exception is thrown, Dispose runs
using var processor = new FileProcessor("data.bin");
Console.WriteLine(processor.Length);`,
  output: `// _stream.Dispose() called automatically when 'using' block exits.
// The FileStream (and its OS file handle) is released immediately.`,
  related: ["idisposable-using", "structs", "boxing-unboxing"],
  mistakes: [
      "Not disposing of IDisposable objects \u2014 relying on the GC to clean up unmanaged resources that the GC doesn't know about",
      "Holding large object graph references in static fields \u2014 prevents GC from collecting the entire subgraph",
      "Allocating in a hot path \u2014 even small, frequent allocations increase GC pressure over time"
  ]
};
