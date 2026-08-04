export default {
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
  related: ["object-initializers", "records"]
};
