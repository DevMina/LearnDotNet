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
  related: ["generics", "structs"],
  mistakes: [
      "Adding value types to non-generic collections (ArrayList, Hashtable) \u2014 each add boxes the value",
      "Unboxing to the wrong type \u2014 you must unbox to the exact original type or it throws InvalidCastException",
      "Using interfaces on structs \u2014 calling an interface method on a struct boxes it implicitly"
  ],

  difficulty: 'intermediate',

  interviewQ: `What is boxing and why is it a performance concern?`,

  interviewA: `Boxing converts a value type (e.g. <code>int</code>) to a heap-allocated <code>object</code>. Unboxing extracts it back. Each boxing operation allocates a new heap object, which puts pressure on the GC. It happens silently in many situations: storing an <code>int</code> in a non-generic <code>ArrayList</code>, passing a struct to a method expecting <code>object</code>, or calling <code>ToString()</code> on a value type via an interface reference. Generics were introduced specifically to eliminate boxing in collections — always prefer <code>List&lt;int&gt;</code> over <code>ArrayList</code>.`,

  whyItMatters: `Boxing is one of the most common hidden performance costs in C# code. In hot paths that process many value types, understanding when boxing occurs — and switching to generics or <code>Span&lt;T&gt;</code> to avoid it — can yield dramatic performance improvements.`,
  prerequisites: ["variables-types","structs"]
};
