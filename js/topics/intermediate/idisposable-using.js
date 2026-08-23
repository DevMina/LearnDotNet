export default {
  tagline: "Deterministic cleanup for limited or unmanaged resources.",
  explanation: `
          <p>Types that hold onto a limited resource — a file handle, a network connection, a database connection — implement <strong>IDisposable</strong> so callers can release it deterministically, rather than waiting for the garbage collector to eventually get around to it.</p>
          <p>The <strong>using</strong> statement guarantees <em>Dispose()</em> runs when the block ends, even if an exception is thrown inside it. A <strong>using declaration</strong> (no braces) does the same thing, disposing at the end of the enclosing scope instead.</p>
        `,
  keyPoints: [
  "Dispose() should be safe to call more than once",
  "using ensures Dispose runs even when an exception occurs inside the block",
  "A using declaration (no braces) disposes at the end of the enclosing scope"
],
  code: `public class ResourceHandle : IDisposable
{
    public void Dispose() => Console.WriteLine("Resource released");
}

using (var handle = new ResourceHandle())
{
    Console.WriteLine("Using the resource");
}`,
  output: `Using the resource
Resource released`,
  mistakes: [
      "Forgetting using on anything that implements IDisposable \u2014 file handles, connections, and streams leak",
      "Calling Dispose manually and then using the object \u2014 always set to null or use using",
      "Implementing IDisposable but not suppressing the finalizer after Dispose \u2014 the GC does double cleanup work"
  ],

  difficulty: 'intermediate',

  interviewQ: `What happens if you do not dispose an <code>IDisposable</code> object?`,

  interviewA: `The object's unmanaged resources (file handles, network connections, database connections, native memory) are not released until the GC finalises the object — which may be a long time later, or never if the process exits unexpectedly. This causes resource leaks, file locks, and connection pool exhaustion. The <code>using</code> statement guarantees <code>Dispose()</code> is called even if an exception is thrown, making it the correct pattern for any <code>IDisposable</code>. In async code, use <code>await using</code> for <code>IAsyncDisposable</code>.`,

  whyItMatters: `Resource leaks are the most common cause of memory pressure, connection pool exhaustion, and file lock issues in .NET services. The <code>using</code> statement and dispose pattern are the mechanisms that make deterministic cleanup possible in a GC-managed runtime.`,

  prerequisites: ["classes-objects","exceptions"],
  related: ["memory-management","exceptions","async-await"]
};
