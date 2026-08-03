export default {
  tagline: "Cooperative cancellation for long-running or async work.",
  explanation: `
          <p>A <strong>CancellationToken</strong> lets calling code signal "stop what you're doing" to an async operation, without forcibly killing a thread. The running code checks the token periodically — or passes it to another cancellable API like <em>Task.Delay</em> — and exits cleanly when cancellation is requested, typically by throwing an <em>OperationCanceledException</em>.</p>
          <p>Cancellation is <strong>cooperative</strong>: nothing stops automatically unless the running code actually checks the token.</p>
        `,
  keyPoints: [
  "Cancellation is cooperative — the running code must check the token itself",
  "CancellationTokenSource creates the token and triggers cancellation",
  "Passing the token into Task.Delay, HTTP calls, etc. lets .NET APIs cancel themselves for you"
],
  code: `async Task CountAsync(CancellationToken token)
{
    for (int i = 1; i <= 5; i++)
    {
        token.ThrowIfCancellationRequested();
        Console.WriteLine($"Tick {i}");
        await Task.Delay(10, token);
    }
}

var cts = new CancellationTokenSource();
cts.CancelAfter(15);

try { await CountAsync(cts.Token); }
catch (OperationCanceledException) { Console.WriteLine("Cancelled"); }`,
  output: `Tick 1
Tick 2
Cancelled`
};
