export default {
  tagline: "Declare constructor parameters right in the class header (C# 12).",
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
  output: `Hello, Ada!`
};
