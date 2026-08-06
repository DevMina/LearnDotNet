export default {
  tagline: "params now works with Span<T>, List<T>, and more, not just arrays (C# 13).",
  explanation: `
          <p>Before C# 13, <strong>params</strong> only accepted an array, which meant every call implicitly allocated a new array on the heap. C# 13 allows any recognized collection type, including <em>Span&lt;T&gt;</em> and <em>ReadOnlySpan&lt;T&gt;</em>, letting the compiler avoid that allocation for the common case of passing a handful of values.</p>
          <p>Callers don't need to change anything — the call site looks identical either way.</p>
        `,
  keyPoints: [
  "params ReadOnlySpan<T> avoids the array allocation params T[] always required",
  "Call sites look identical — callers don’t need to change anything",
  "IEnumerable<T>, List<T>, and other collection types are supported too"
],
  code: `int Sum(params ReadOnlySpan<int> values)
{
    int total = 0;
    foreach (var v in values) total += v;
    return total;
}

Console.WriteLine(Sum(1, 2, 3, 4));`,
  output: `10`,
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ]
};
