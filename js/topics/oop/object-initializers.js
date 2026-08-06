export default {
  tagline: "Set properties right where you construct the object.",
  explanation: `
          <p>An <strong>object initializer</strong> lets you set public properties or fields immediately after construction, in a single expression, without writing a matching constructor overload for every combination of values.</p>
          <p>It's syntactic sugar: the compiler still calls the constructor first (parameterless unless you specify one), then assigns each property in order. It pairs well with <em>init</em>-only properties when you want the object immutable after that point.</p>
        `,
  keyPoints: [
  "Object initializers run after the constructor, assigning properties in order",
  "Avoids writing a constructor overload for every combination of properties",
  "Works with nested objects and collections too: new Order { Items = { ... } }"
],
  code: `public class Car
{
    public string Model { get; set; } = "";
    public int Year { get; set; }
}

var car = new Car { Model = "Civic", Year = 2024 };
Console.WriteLine($"{car.Year} {car.Model}");`,
  output: `2024 Civic`,
  related: ["init-only-properties", "records"],
  mistakes: [
      "Using object initializers to bypass validation in the constructor \u2014 the constructor runs first, but properties with setters have no guard",
      "Initialising the same property in both the constructor and an initializer \u2014 the initializer wins, silently",
      "Using object initializers on types with only a non-public constructor \u2014 compiler error, not always obvious why"
  ]
};
