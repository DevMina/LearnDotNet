export default {
  tagline: "Partial blueprints that can’t be instantiated directly.",
  explanation: `
          <p>An <strong>abstract class</strong> can mix implemented members with <em>abstract</em> members that have no body — subclasses are required to implement them. Unlike an interface, an abstract class can hold shared state and constructor logic, making it a good fit when related types share real behavior, not just a contract.</p>
          <p>You cannot create an instance of an abstract class directly with <em>new</em>; it only exists to be extended.</p>
        `,
  keyPoints: [
  "Abstract classes can have both implemented and abstract members",
  "Cannot be instantiated directly — only through a derived class",
  "Choose abstract class over interface when subclasses share real state or logic"
],
  code: `public abstract class Employee
{
    public string Name { get; init; }
    public abstract decimal CalculatePay();

    public void PrintPaycheck() =>
        Console.WriteLine($"{Name}: {CalculatePay():C}");
}

public class SalariedEmployee : Employee
{
    public decimal AnnualSalary { get; init; }
    public override decimal CalculatePay() => AnnualSalary / 12;
}

Employee e = new SalariedEmployee { Name = "Sam", AnnualSalary = 84000 };
e.PrintPaycheck();`,
  output: `Sam: $7,000.00`,
  prerequisites: ["classes-objects","interfaces"],
  mistakes: [
      "Making a class abstract when an interface would do \u2014 abstract classes consume the single base-class slot",
      "Putting too much concrete logic in an abstract class \u2014 makes subclasses harder to test in isolation",
      "Forgetting that abstract classes can have constructors \u2014 they run when the subclass is instantiated"
  ],
  interviewQ: `When should you choose an abstract class over an interface?`,
  interviewA: `Choose an abstract class when you need to share implementation (concrete methods, fields, constructors) between related types and the types share a common identity. Choose an interface when you want to define a capability that unrelated types can adopt. In modern C# (8+) interfaces can have default implementations, which blurs the line — but abstract classes are still better when shared state or constructors are required.`,
  whyItMatters: `Abstract classes let you build extensible frameworks — define the skeleton of an algorithm and leave specific steps to subclasses (the Template Method pattern). They strike the balance between total flexibility (interfaces) and total implementation (concrete classes).`,
  related: ["inheritance","interfaces","classes-objects","polymorphism"],
  difficulty: 'intermediate'
};
