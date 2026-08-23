export default {
  tagline: "Write one algorithm that works across many types, safely.",
  explanation: `
          <p><strong>Generics</strong> let you parameterize a class or method by type, so <em>List&lt;T&gt;</em> works identically whether T is <em>int</em>, <em>string</em>, or a custom class — without boxing value types or casting objects, and with full compile-time type checking.</p>
          <p>Constraints (<em>where T : IComparable&lt;T&gt;</em>) restrict what T can be, letting you call members on T that the compiler otherwise couldn't guarantee exist.</p>
        `,
  keyPoints: [
  "Generics give type safety without duplicating code per type",
  "Constraints (where T : ...) unlock operations on the generic type",
  "Avoids boxing/unboxing overhead that untyped collections had"
],
  code: `T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) > 0 ? a : b;

Console.WriteLine(Max(3, 7));
Console.WriteLine(Max("pear", "kiwi"));`,
  output: `7
pear`,
  related: ["boxing-unboxing"],
  prerequisites: ["classes-objects","interfaces"],
  mistakes: [
      "Forgetting type constraints \u2014 unconstrained T can't call any methods, use where T : IMyInterface",
      "Creating unnecessary generic types when the concrete type is always the same at every call site",
      "Confusing generic type variance \u2014 List<Dog> is not assignable to List<Animal> even if Dog : Animal"
  ],
  interviewQ: `What does the generic constraint <code>where T : class</code> do, and how does it differ from <code>where T : struct</code>?`,
  interviewA: `<code>where T : class</code> restricts the type argument to reference types, which means <code>T</code> can be null and the compiler allows null checks. <code>where T : struct</code> restricts to value types, which means <code>T</code> can never be null and the runtime can avoid boxing. Other useful constraints: <code>new()</code> (must have a parameterless constructor), <code>IComparable&lt;T&gt;</code> (must implement an interface), and <code>notnull</code> (disallows nullable types).`,
  whyItMatters: `Generics eliminate the need to write the same algorithm multiple times for different types. They are used throughout .NET — <code>List&lt;T&gt;</code>, <code>Dictionary&lt;K,V&gt;</code>, <code>Task&lt;T&gt;</code> — and understanding them is essential for reading and writing idiomatic C#.`,
  difficulty: 'intermediate'
};
