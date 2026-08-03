export default {
  tagline: "Type-safe references to methods, and the pub/sub pattern built on them.",
  explanation: `
          <p>A <strong>delegate</strong> is a type-safe function pointer — a variable that holds a reference to a method matching a given signature. <strong>Action</strong> and <strong>Func</strong> are built-in generic delegate types for the common cases of "no return value" and "returns a value."</p>
          <p>An <strong>event</strong> wraps a delegate to implement publish/subscribe: a class exposes an event, other code subscribes with <em>+=</em>, and the class invokes it when something happens — without the subscribers needing a reference to each other.</p>
        `,
  keyPoints: [
  "Action<T> and Func<T,TResult> cover most delegate use cases without a custom delegate type",
  "Events restrict outside code to only += and -=, not direct invocation",
  "Multiple methods can subscribe to the same event (multicast)"
],
  code: `public class Button
{
    public event Action? Clicked;
    public void Click() => Clicked?.Invoke();
}

var button = new Button();
button.Clicked += () => Console.WriteLine("Handler A fired");
button.Clicked += () => Console.WriteLine("Handler B fired");
button.Click();`,
  output: `Handler A fired
Handler B fired`
};
