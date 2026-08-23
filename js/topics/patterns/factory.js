export default {
  tagline: "Centralize object creation logic.",
  explanation: `
          <p>The <strong>Factory</strong> pattern moves the decision of *which concrete type to create* into one place, so calling code depends only on an interface or base type, not a specific implementation. This makes it easy to add new types later without touching the calling code.</p>
          <p>It's especially useful when construction involves branching logic (based on config, input, or environment) that would otherwise be duplicated everywhere an object is created.</p>
        `,
  keyPoints: [
  "Calling code depends on the abstraction, not the concrete class",
  "Centralizes branching creation logic in a single method",
  "Adding a new variant means changing the factory only, not every call site"
],
  code: `public interface INotifier { void Send(string msg); }
public class EmailNotifier : INotifier
{ public void Send(string msg) => Console.WriteLine($"Email: {msg}"); }
public class SmsNotifier : INotifier
{ public void Send(string msg) => Console.WriteLine($"SMS: {msg}"); }

static class NotifierFactory
{
    public static INotifier Create(string channel) => channel switch
    {
        "email" => new EmailNotifier(),
        "sms"   => new SmsNotifier(),
        _ => throw new ArgumentException("Unknown channel")
    };
}

NotifierFactory.Create("sms").Send("Order shipped");`,
  output: `SMS: Order shipped`,
  mistakes: [
      "Returning concrete types from a factory instead of an interface \u2014 defeats the purpose of abstracting construction",
      "Overcomplicating a factory when a constructor with optional parameters would do",
      "Not handling the unknown type case \u2014 a factory switch with no default throws at runtime"
  ],

  difficulty: 'intermediate',

  interviewQ: `What is the difference between Factory Method and Abstract Factory?`,

  interviewA: `Factory Method defines one method for creating one product type — subclasses override it to produce different concrete products. Abstract Factory defines a family of related factory methods — implementations produce a set of products that are designed to work together (e.g. a UI factory that produces matching Button + Checkbox + Dialog). Use Factory Method when you need to decouple a single object's creation. Use Abstract Factory when you need to ensure a set of created objects are compatible with each other.`,

  whyItMatters: `Factory patterns decouple object creation from usage, enabling you to change which concrete type is created without touching the calling code. This is the foundation of plugin architectures and testability — swap the factory for a test factory that returns fakes.`,

  prerequisites: ["classes-objects","interfaces"],
  related: ["interfaces","classes-objects","dependency-injection","strategy"]
};
