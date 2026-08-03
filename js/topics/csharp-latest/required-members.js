export default {
  tagline: "Force callers to set specific properties at construction time (C# 11).",
  explanation: `
          <p>The <strong>required</strong> modifier on a property means an object initializer must set that property, or the code simply won't compile. This closes a long-standing gap — previously the only way to guarantee a property was set was a constructor parameter, which didn't compose well with object initializer syntax.</p>
          <p>It pairs naturally with <strong>init</strong>: the property must be set once at construction, and can't be changed after that.</p>
        `,
  keyPoints: [
  "Enforced at compile time, not runtime",
  "Pairs naturally with init so the property stays immutable after construction",
  "Lets you use object initializer syntax while still guaranteeing key properties are set"
],
  code: `public class Order
{
    public required string CustomerName { get; init; }
    public required decimal Total { get; init; }
}

var order = new Order { CustomerName = "Priya", Total = 42.50m };
Console.WriteLine($"{order.CustomerName}: {order.Total:C}");`,
  output: `Priya: $42.50`
};
