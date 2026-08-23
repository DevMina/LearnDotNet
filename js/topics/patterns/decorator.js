export default {
  tagline: "Wrap an object to add behavior without changing its class.",
  explanation: `
          <p>The <strong>Decorator</strong> pattern wraps an object in another object implementing the same interface, adding behavior before or after delegating to the wrapped instance. Decorators can be <strong>stacked</strong>, letting you compose behavior — logging, caching, retry logic — without a combinatorial explosion of subclasses for every combination.</p>
          <p>The key requirement: the decorator implements the exact same interface as the thing it wraps, so callers can't tell the difference.</p>
        `,
  keyPoints: [
  "The decorator implements the same interface as the object it wraps",
  "Multiple decorators can be layered on top of each other",
  "Avoids a separate subclass for every combination of optional behavior"
],
  code: `public interface INotifier { void Send(string msg); }

public class BaseNotifier : INotifier
{
    public void Send(string msg) => Console.WriteLine($"Sending: {msg}");
}

public class LoggingDecorator : INotifier
{
    private readonly INotifier _inner;
    public LoggingDecorator(INotifier inner) => _inner = inner;

    public void Send(string msg)
    {
        Console.WriteLine("Log: about to send");
        _inner.Send(msg);
    }
}

INotifier notifier = new LoggingDecorator(new BaseNotifier());
notifier.Send("Order shipped");`,
  output: `Log: about to send
Sending: Order shipped`,
  related: ["adapter"],
  mistakes: [
      "Decorating a type you don't own without an interface in common \u2014 use an adapter or wrapper instead",
      "Stacking many decorators and forgetting which order they execute \u2014 outer decorators run first",
      "Making decorators stateful in a way that depends on execution order \u2014 fragile and hard to test"
  ],

  difficulty: 'intermediate',

  interviewQ: `How does the Decorator pattern differ from subclassing?`,

  interviewA: `Subclassing adds behaviour at compile time and is permanent — you cannot add or remove it at runtime, and you can only inherit from one class. Decoration wraps an existing object at runtime and composes behaviour dynamically. Multiple decorators can be stacked in any order: <code>new LoggingService(new CachingService(new RealService()))</code>. The Decorator pattern also works with interfaces, so it does not care about the wrapped type's class hierarchy. In .NET, <code>Stream</code> is a canonical example: <code>GZipStream</code> wraps any <code>Stream</code> to add compression.`,

  whyItMatters: `The Decorator pattern is how ASP.NET Core middleware works — each middleware wraps the next in the pipeline. It is also the correct way to add cross-cutting concerns (logging, caching, retry) to a service without modifying it, which is the Open/Closed Principle in action.`,

  prerequisites: ["interfaces","classes-objects"],
};
