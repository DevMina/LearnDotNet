export default {
  versionLabel: "C# 13",
  tagline: "params now works with Span<T>, List<T>, and more, not just arrays.",
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
  prerequisites: ["arrays-collections","generics"],
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ],
  difficulty: 'intermediate',
  whyItMatters: `The expanded params keyword lets API authors accept any collection type — Span&lt;T&gt;, List&lt;T&gt;, IEnumerable&lt;T&gt; — rather than forcing callers through an intermediate array allocation. For high-frequency call sites this eliminates an allocation per call.`,
  interviewQ: `What allocation advantage does <code>params ReadOnlySpan&lt;T&gt;</code> have over <code>params T[]</code>?`,
  interviewA: `<code>params T[]</code> always allocates a new array on the heap for the arguments. <code>params ReadOnlySpan&lt;T&gt;</code> lets the compiler use a stack-allocated buffer for small argument counts — no heap allocation at all. This is significant for logging methods, string-building helpers, and any other utility that is called thousands of times per second. The .NET runtime itself uses this pattern in its internal APIs.`,
  related: ["methods-parameters","arrays-collections","span"]
};
