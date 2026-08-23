export default {
  versionLabel: "C# 12",
  tagline: "One bracket syntax for building any collection type.",
  explanation: `
          <p><strong>Collection expressions</strong> let you write <em>[1, 2, 3]</em> to build an array, a <em>List&lt;T&gt;</em>, a <em>Span&lt;T&gt;</em>, or any type with a compatible construction pattern — replacing the mix of <em>new[] { }</em> and <em>new List&lt;T&gt; { }</em> syntax with one consistent form.</p>
          <p>The <strong>spread operator</strong> (<em>..</em>) inlines the contents of another collection into a new one, similar to spread syntax in JavaScript.</p>
        `,
  keyPoints: [
  "One bracket syntax works across arrays, List<T>, Span<T>, and more",
  "The spread operator .. inlines another collection’s elements",
  "The compiler infers the target type from context, like target-typed new"
],
  code: `int[] numbers = [1, 2, 3];
List<int> more = [..numbers, 4, 5];

Console.WriteLine(string.Join(", ", more));`,
  output: `1, 2, 3, 4, 5`,
  prerequisites: ["arrays-collections", "generics"],
  mistakes: [
      "Using collection expressions where the target type is ambiguous \u2014 the compiler needs to infer the type",
      "Assuming spread (..) copies deeply \u2014 it's a shallow spread, nested references are shared",
      "Mixing collection expressions with LINQ chains before materialising \u2014 the expression must produce a concrete type first"
  ],
  difficulty: 'beginner',
  whyItMatters: `Collection expressions provide a single, consistent syntax (<code>[...]</code>) for initialising arrays, lists, spans, and immutable collections. Previously each type required different syntax; now switching the type of a variable does not require rewriting every initialiser in your codebase.`,
  interviewQ: `What is the spread element (<code>..</code>) in a collection expression?`,
  interviewA: `The spread element (<code>..</code>) inlines the elements of another collection into the new one — similar to the spread operator in JavaScript. For example: <code>int[] merged = [..first, ..second, 99];</code> produces a new array with all elements of <code>first</code>, then <code>second</code>, then 99. The compiler generates the most efficient code for the target type — for arrays it may use <code>Array.Copy</code>; for spans it may use <code>Span.CopyTo</code>.`,
  related: ["arrays-collections","generics","span","params-collections"]
};
