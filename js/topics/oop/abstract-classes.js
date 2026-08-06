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
  mistakes: [
      "Making a class abstract when an interface would do \u2014 abstract classes consume the single base-class slot",
      "Putting too much concrete logic in an abstract class \u2014 makes subclasses harder to test in isolation",
      "Forgetting that abstract classes can have constructors \u2014 they run when the subclass is instantiated"
  ]
};
