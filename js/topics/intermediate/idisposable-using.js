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
Resource released`
};
