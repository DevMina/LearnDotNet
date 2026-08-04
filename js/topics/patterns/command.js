export default {
  tagline: "Turn a request into an object you can queue, log, or undo.",
  explanation: `
          <p>The <strong>Command</strong> pattern wraps an action and its parameters inside an object implementing a common interface (typically a single <em>Execute()</em> method), decoupling the code that invokes an action from the code that knows how to perform it.</p>
          <p>Because the request is now an object, it can be queued, logged, retried, or paired with an <em>Undo()</em> method — this is the pattern behind menu actions, task queues, and undo/redo stacks in editors.</p>
        `,
  keyPoints: [
  "Command wraps a request as an object with a common Execute() interface",
  "Decouples the invoker (button, queue) from the receiver that does the work",
  "Naturally supports queuing, logging, retrying, and undo/redo"
],
  code: `public interface ICommand
{
    void Execute();
}

public class AddItemCommand : ICommand
{
    private readonly List<string> _cart;
    private readonly string _item;
    public AddItemCommand(List<string> cart, string item)
        => (_cart, _item) = (cart, item);

    public void Execute() => _cart.Add(_item);
}

var cart = new List<string>();
ICommand command = new AddItemCommand(cart, "Keyboard");
command.Execute();

Console.WriteLine(string.Join(", ", cart));`,
  output: `Keyboard`,
  related: ["strategy", "observer"]
};
