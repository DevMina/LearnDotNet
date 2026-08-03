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
pear`
};
