export default {
  versionLabel: "C# 9",
  tagline: "Settable during construction, read-only ever after.",
  explanation: `
          <p>An <strong>init</strong> accessor, introduced in C# 9, works like <em>set</em> but can only be called during object initialization — in the constructor or an object initializer. After that, the property is effectively read-only.</p>
          <p>This gives you the convenience of object-initializer syntax while still producing genuinely immutable objects, which is exactly what the compiler generates for you automatically in a <strong>record</strong>'s positional properties.</p>
        `,
  keyPoints: [
  "init behaves like set, but only inside a constructor or object initializer",
  "Combines object-initializer syntax with true post-construction immutability",
  "Records use init-only properties under the hood for their positional parameters"
],
  code: `public class Order
{
    public int Id { get; init; }
    public string Status { get; init; } = "Pending";
}

var order = new Order { Id = 501, Status = "Shipped" };
Console.WriteLine($"{order.Id}: {order.Status}");
// order.Status = "Cancelled"; // compile error — init-only`,
  output: `501: Shipped`,
  related: ["object-initializers", "records"],
  prerequisites: ["classes-objects","classes-objects"],
  mistakes: [
      "Trying to set an init property after the object initializer \u2014 compiler error, but sometimes surprises people",
      "Using init when you actually need a mutable setter \u2014 init is a one-way door",
      "Forgetting that init properties can still be set in a derived class constructor \u2014 visibility follows normal rules"
  ],
  difficulty: 'beginner',
  whyItMatters: `Init-only properties enable immutable-by-default objects that still support object-initializer syntax — you get the readability of <code>new Foo { X = 1 }</code> without allowing post-construction mutation. They are the foundation of the modern immutable data model in C# alongside records.`,
  interviewQ: `What is the difference between <code>init</code> and <code>set</code> on a property?`,
  interviewA: `<code>set</code> allows the property to be assigned at any time from any code. <code>init</code> restricts assignment to the object-initializer block or the constructor — after construction is complete, the property is effectively readonly. This lets you model immutable value objects without giving up the convenient object-initializer syntax, and without writing a constructor with every property as a parameter.`
};
