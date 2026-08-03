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
  output: `SMS: Order shipped`
};
