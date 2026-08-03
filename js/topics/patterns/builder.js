export default {
  tagline: "Construct a complex object step by step.",
  explanation: `
          <p>The <strong>Builder</strong> pattern separates the construction of a complex object from its final representation, letting you assemble it through a series of chained method calls instead of one enormous constructor. It shines when an object has many optional configuration options, most of which have sensible defaults.</p>
          <p>Each builder method typically returns the builder itself, enabling <strong>method chaining</strong>, and a final <em>Build()</em> call produces the fully configured object.</p>
        `,
  keyPoints: [
  "Each builder method typically returns the builder itself, enabling method chaining",
  "Avoids constructors with a long list of optional parameters",
  "A final Build() call produces the fully configured, often immutable, object"
],
  code: `public class PizzaBuilder
{
    private readonly List<string> _toppings = new();

    public PizzaBuilder AddTopping(string topping)
    {
        _toppings.Add(topping);
        return this;
    }

    public string Build() => $"Pizza with: {string.Join(", ", _toppings)}";
}

var pizza = new PizzaBuilder()
    .AddTopping("mozzarella")
    .AddTopping("basil")
    .Build();

Console.WriteLine(pizza);`,
  output: `Pizza with: mozzarella, basil`
};
