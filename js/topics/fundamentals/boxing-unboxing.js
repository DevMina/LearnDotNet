export default {
  tagline: "The hidden cost of treating a value type as an object.",
  explanation: `
          <p><strong>Boxing</strong> copies a value type (like <em>int</em> or a <em>struct</em>) onto the heap and wraps it in an <em>object</em>, so it can be used wherever a reference type is expected. <strong>Unboxing</strong> copies it back out into a value-type variable.</p>
          <p>Both are implicit and easy to trigger accidentally — adding an <em>int</em> to a non-generic <em>ArrayList</em>, for example — and each one allocates memory and copies data. Generic collections like <em>List&lt;int&gt;</em> avoid this entirely, which is one reason they replaced non-generic collections.</p>
        `,
  keyPoints: [
  "Boxing allocates a heap object to hold a copy of a value type",
  "Unboxing requires an exact type match or it throws InvalidCastException",
  "Generics (List<T> vs ArrayList) avoid boxing and its allocation overhead"
],
  code: `int number = 42;
object boxed = number;

number = 100;
Console.WriteLine(boxed);

int unboxed = (int)boxed;
Console.WriteLine(unboxed);`,
  output: `42
42`,
  related: ["generics", "structs"]
};
