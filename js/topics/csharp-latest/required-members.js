export default {
  versionLabel: "C# 11",
  tagline: "Force callers to set specific properties at construction time.",
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
  output: `Priya: $42.50`,
  prerequisites: ["classes-objects","classes-objects"],
  mistakes: [
      "Marking a property required but providing a default value \u2014 the default is ignored if required is not satisfied",
      "Using required on a property with a private setter \u2014 callers can't set it, so required can never be satisfied from outside",
      "Confusing required (must be set on construction) with [NotNull] (nullable annotation)"
  ],
  difficulty: 'intermediate',
  whyItMatters: `Required members enforce that callers set specific properties at construction time without requiring a constructor. They bridge the gap between the flexibility of object initialisers and the correctness of constructor-parameter enforcement — the compiler errors if a required property is omitted.`,
  interviewQ: `What is the difference between the <code>required</code> modifier and <code>[Required]</code> from System.ComponentModel.DataAnnotations?`,
  interviewA: `<code>required</code> (C# 11) is a compiler enforcement — the code does not compile if a required property is omitted in an object initialiser. <code>[Required]</code> is a runtime attribute used by model binding and validation frameworks (ASP.NET Core, EF Core) — it only has effect when a validator explicitly reads and checks the attribute. You can have both: <code>required</code> enforces at compile time that the developer sets the property; <code>[Required]</code> enforces at runtime that the HTTP client sent it.`,
  related: ["classes-objects","model-validation","records"]
};
