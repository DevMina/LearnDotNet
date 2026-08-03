export default {
  tagline: "Generate a sequence lazily, one item at a time.",
  explanation: `
          <p>The <strong>yield return</strong> keyword lets you write a method that produces an <em>IEnumerable&lt;T&gt;</em> without building the whole collection up front. Each call to the enumerator's <em>MoveNext()</em> resumes the method exactly where it left off, with all local state preserved automatically.</p>
          <p>This makes it possible to lazily generate expensive or even infinite sequences, since only the items actually consumed are ever computed.</p>
        `,
  keyPoints: [
  "yield return produces the next element and pauses the method until the next item is requested",
  "The method’s local variables and loop position are preserved between calls automatically",
  "Enables infinite sequences, since only the items actually consumed are ever computed"
],
  code: `IEnumerable<int> Fibonacci(int count)
{
    int a = 0, b = 1;
    for (int i = 0; i < count; i++)
    {
        yield return a;
        (a, b) = (b, a + b);
    }
}

Console.WriteLine(string.Join(", ", Fibonacci(8)));`,
  output: `0, 1, 1, 2, 3, 5, 8, 13`
};
