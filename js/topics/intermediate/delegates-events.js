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
Handler B fired`,
  prerequisites: ["classes-objects"],
  mistakes: [
      "Not null-checking an event before invoking \u2014 use event?.Invoke() to avoid NullReferenceException",
      "Forgetting to unsubscribe from events \u2014 keeps the subscriber alive, causing memory leaks",
      "Using public fields of delegate type instead of event \u2014 any caller can fire or clear the delegate"
  ],
  interviewQ: `What is the difference between a delegate and an event in C#?`,
  interviewA: `A delegate is a type-safe function pointer — it can be invoked by anyone who holds a reference to it. An event wraps a delegate with access modifiers: only the declaring class can invoke it; external subscribers can only add or remove handlers. This prevents external code from accidentally clearing all subscribers or firing the event. The convention is to use <code>EventHandler&lt;TEventArgs&gt;</code> for events and <code>Func</code>/<code>Action</code> for callbacks.`,
  whyItMatters: `Delegates and events are the foundation of the observer pattern in C#. They underpin GUI frameworks, async patterns, and decoupled component communication — understanding them is essential for working with any event-driven code.`,
  related: ["async-await","observer","linq","expression-trees"],
  difficulty: 'intermediate'
};
