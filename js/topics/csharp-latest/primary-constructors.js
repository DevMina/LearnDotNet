export default {
  versionLabel: "C# 12",
  tagline: "Declare constructor parameters right in the class header.",
  explanation: `
          <p><strong>Primary constructors</strong>, previously exclusive to records, are available on any class or struct since C# 12. Parameters declared in the type header are in scope throughout the whole class body — not just in field initializers — so you can use them directly in methods without assigning them to fields first.</p>
          <p>Unlike a record's primary constructor, these parameters don't automatically become public properties — if you want that, you still assign them explicitly.</p>
        `,
  keyPoints: [
  "Available for classes and structs since C# 12, not only records",
  "Parameters are in scope for the whole class body, not just field initializers",
  "Parameters aren’t automatically properties unless you assign them explicitly"
],
  code: `public class Greeter(string name)
{
    public string Greet() => $"Hello, {name}!";
}

var greeter = new Greeter("Ada");
Console.WriteLine(greeter.Greet());`,
  output: `Hello, Ada!`,
  prerequisites: ["classes-objects","classes-objects"],
  mistakes: [
      "Capturing a mutable parameter and modifying it \u2014 the same parameter is shared across all uses in the class",
      "Using primary constructors for classes with complex validation \u2014 move validation to a factory method instead",
      "Forgetting that primary constructor parameters aren't automatically exposed as properties \u2014 declare them if needed"
  ],
  difficulty: 'intermediate',
  whyItMatters: `Primary constructors collapse three repetitive steps — parameter declaration, field declaration, field assignment — into one. In dependency-injection-heavy code where classes often have four or five constructor-injected services, this reduces noise significantly.`,
  interviewQ: `What is the difference between a primary constructor and a regular constructor in C#?`,
  interviewA: `A primary constructor is declared in the class header (<code>class Service(ILogger logger)</code>) and its parameters are in scope throughout the class body. A regular constructor is an explicit method body. Key difference: primary constructor parameters are not automatically stored as fields — if you need to retain them, you must assign them to a field or property yourself (or rely on the compiler to capture them in closures). Records auto-generate properties from primary constructor parameters; classes do not.`,
  related: ["classes-objects","dependency-injection","records"]
};
