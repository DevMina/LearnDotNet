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
  output: `Civic (2023)`,
  mistakes: [
      "Forgetting to initialise fields \u2014 reference type fields default to null, not an empty object",
      "Making everything public \u2014 prefer private fields with properties to control access",
      "Creating very large classes \u2014 split responsibilities when a class has more than one reason to change"
  ],
  interviewQ: `What is the difference between a class and a struct in C#?`,
  interviewA: `A <code>class</code> is a reference type — variables hold a reference to the object on the heap, so assignment copies the reference. A <code>struct</code> is a value type — the data lives inline (often on the stack or inside another object), so assignment copies the entire value. Use structs for small, immutable, frequently-allocated data (like <code>Vector2</code> or <code>Point</code>); use classes for everything else.`,
  whyItMatters: `Classes are the fundamental unit of object-oriented design in C#. Understanding the class-vs-struct distinction helps you write code that is both correct and efficient — choosing the wrong one can cause subtle aliasing bugs or unnecessary heap pressure.`,
  related: ["inheritance","interfaces","structs","encapsulation","records"],
  difficulty: 'beginner',
  prerequisites: ["variables-types","methods-parameters"]
};
