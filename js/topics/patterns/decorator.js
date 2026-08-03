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
Sending: Order shipped`
};
