export default {
  tagline: "A contract for what a type can do, not how.",
  explanation: `
          <p>An <strong>interface</strong> declares members without implementing them — it's a contract. Any class or struct that implements the interface must provide the implementation. A single class can implement any number of interfaces, which is how C# achieves multiple-inheritance-like flexibility.</p>
          <p>Interfaces are the backbone of dependency injection and testability: code that depends on <em>ILogger</em> rather than a concrete <em>FileLogger</em> can be swapped or mocked freely.</p>
        `,
  keyPoints: [
  "A class can implement multiple interfaces",
  "Interfaces enable loose coupling and easier unit testing",
  "Since C# 8, interfaces can include default method implementations"
],
  code: `public interface IShape
{
    double Area();
}

public class Circle : IShape
{
    public double Radius { get; init; }
    public double Area() => Math.PI * Radius * Radius;
}

IShape shape = new Circle { Radius = 2 };
Console.WriteLine($"Area: {shape.Area():F2}");`,
  output: `Area: 12.57`
};
