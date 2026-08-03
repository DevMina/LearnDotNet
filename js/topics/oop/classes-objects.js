export default {
  tagline: "The blueprint (class) and the instance (object).",
  explanation: `
          <p>A <strong>class</strong> defines the shape of something — its fields, properties, and methods. An <strong>object</strong> is a concrete instance created from that blueprint with <em>new</em>. Properties (using <em>get</em>/<em>set</em>) expose a class's state while letting you control how it's read or written.</p>
          <p>Constructors initialize a new object's state; C# also supports <strong>object initializer syntax</strong> to set public properties inline at creation time.</p>
        `,
  keyPoints: [
  "Properties can have different access levels for get vs set",
  "Object initializers set properties without a custom constructor",
  "this refers to the current instance inside a method"
],
  code: `public class Car
{
    public string Model { get; set; }
    public int Year { get; private set; }

    public Car(string model, int year)
    {
        Model = model;
        Year = year;
    }
}

var car = new Car("Civic", 2023);
Console.WriteLine($"{car.Model} ({car.Year})");`,
  output: `Civic (2023)`
};
