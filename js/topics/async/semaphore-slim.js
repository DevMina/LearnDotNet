export default {
  tagline: "Limit concurrency to a fixed number of workers.",
  explanation: `
          <p>While <strong>lock</strong> allows only one thread in at a time, <strong>SemaphoreSlim</strong> allows a configurable number of concurrent callers — useful for throttling access to a limited resource, like capping how many HTTP requests run in parallel.</p>
          <p>Unlike <em>lock</em>, it has an async-friendly <em>WaitAsync()</em> that doesn't block a thread while waiting, making it the right choice for throttling concurrent <em>async</em> work rather than raw multithreading.</p>
        `,
  keyPoints: [
  "SemaphoreSlim(n) allows up to n concurrent callers through Wait/WaitAsync",
  "WaitAsync() doesn't block a thread, unlike lock — ideal for async throttling",
  "Always Release() in a finally block to avoid permanently starving other callers"
],
  code: `var semaphore = new SemaphoreSlim(2);

async Task DoWorkAsync(int id)
{
    await semaphore.WaitAsync();
    try
    {
        Console.WriteLine($"Task {id} running");
        await Task.Delay(100);
    }
    finally
    {
        semaphore.Release();
    }
}

await Task.WhenAll(Enumerable.Range(1, 3).Select(DoWorkAsync));
Console.WriteLine("All done");`,
  output: `Task 1 running
Task 2 running
Task 3 running
All done`,
  related: ["lock-object", "threading-basics"]
};
