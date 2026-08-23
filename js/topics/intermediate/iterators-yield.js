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
  output: `0, 1, 1, 2, 3, 5, 8, 13`,
  mistakes: [
      "Forgetting that yield return is lazy \u2014 code before the first yield doesn't run until enumeration starts",
      "Wrapping a yield method in try/catch around the yield \u2014 catch doesn't catch exceptions from the caller's enumeration",
      "Returning IEnumerable<T> and the caller enumerates it twice \u2014 if it's a live query, results may differ"
  ],

  difficulty: 'intermediate',

  interviewQ: `How does <code>yield return</code> work under the hood?`,

  interviewA: `The compiler transforms a method containing <code>yield return</code> into a state machine class implementing <code>IEnumerable&lt;T&gt;</code> and <code>IEnumerator&lt;T&gt;</code>. Each call to <code>MoveNext()</code> resumes execution from where <code>yield return</code> left off, preserving local variable state between calls. This means the method body runs lazily — only as much as the caller consumes. If the caller stops iterating early (e.g. via <code>Take(5)</code>), the rest of the method never executes.`,

  whyItMatters: `Iterators enable lazy, on-demand sequences without materialising the entire collection in memory. Generating an infinite Fibonacci sequence, reading a CSV file line by line, or paging through API results all benefit from this pattern.`,

  prerequisites: ["arrays-collections","delegates-events"],
  related: ["arrays-collections","async-streams","linq","valuetask"]
};
