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
  related: ["strategy", "observer"],
  mistakes: [
      "Commands that directly modify shared state without going through a queue or handler \u2014 loses the undo/replay benefit",
      "Making commands too coarse \u2014 one command per user action, not one command for a workflow",
      "Not handling command failure \u2014 what happens if Execute throws needs to be part of the design"
  ],

  difficulty: 'intermediate',

  interviewQ: `How does the Command pattern relate to MediatR and CQRS?`,

  interviewA: `MediatR is a library that implements the Mediator pattern, but its <code>IRequest</code>/<code>IRequestHandler</code> pair is essentially the Command pattern — each command is a class with its own handler, decoupled via MediatR from whatever sends the command. CQRS (Command Query Responsibility Segregation) takes this further by separating read models (queries) from write models (commands). The Command pattern is the building block: encapsulate a request as an object so it can be queued, logged, undone, or dispatched to different handlers.`,

  whyItMatters: `The Command pattern enables undo/redo, queuing, audit logging, and transactional boundaries by treating operations as first-class objects. In modern C# backends, it is the backbone of the increasingly popular CQRS + MediatR architecture.`,

  prerequisites: ["interfaces","delegates-events"],
};
