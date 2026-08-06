export default {
  tagline: "One bracket syntax for building any collection type (C# 12).",
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
  mistakes: [
      "Using collection expressions where the target type is ambiguous \u2014 the compiler needs to infer the type",
      "Assuming spread (..) copies deeply \u2014 it's a shallow spread, nested references are shared",
      "Mixing collection expressions with LINQ chains before materialising \u2014 the expression must produce a concrete type first"
  ]
};
