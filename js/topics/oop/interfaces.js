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
  output: `Area: 12.57`,
  related: ["dependency-injection"],
  prerequisites: ["classes-objects"],
  mistakes: [
      "Implementing an interface but making methods throw NotImplementedException \u2014 violates the Liskov principle",
      "Creating interfaces with too many members \u2014 prefer small, focused interfaces (Interface Segregation)",
      "Adding methods to a published interface and breaking all implementors \u2014 use default interface methods or a new interface"
  ],
  interviewQ: `What is the difference between an interface and an abstract class in C#?`,
  interviewA: `An interface defines a contract (what a type can do) with no implementation. An abstract class can mix abstract members with concrete ones and may hold state. A class can implement many interfaces but can only inherit from one class. Use interfaces to define capabilities (<code>IDisposable</code>, <code>IComparable</code>); use abstract classes when you need shared implementation alongside the contract.`,
  whyItMatters: `Interfaces are the backbone of loose coupling in C#. Almost every major .NET API — DI containers, serialisers, EF Core — is built around interfaces, which is why understanding them unlocks the rest of the ecosystem.`,
  difficulty: 'intermediate'
};
