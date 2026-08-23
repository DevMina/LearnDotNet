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
  related: ["lock-object", "threading-basics"],
  mistakes: [
      "Forgetting Release() in the success path \u2014 the semaphore count never recovers, eventually starving all callers",
      "Not using try/finally around WaitAsync \u2014 an exception between Wait and Release leaks the slot permanently",
      "Using SemaphoreSlim(1,1) as a mutex but calling it from the same thread twice \u2014 it's not reentrant, it deadlocks"
  ],

  difficulty: 'advanced',

  interviewQ: `What is the difference between <code>lock</code> and <code>SemaphoreSlim</code>?`,

  interviewA: `<code>lock</code> is a mutual exclusion primitive — only one thread at a time, synchronous only, and it blocks the thread while waiting. <code>SemaphoreSlim</code> allows up to N concurrent waiters (set count to 1 for mutual exclusion), supports <code>await WaitAsync()</code> so the thread is not blocked while waiting, and can be used across async continuations (unlike <code>lock</code>, which cannot be held across an <code>await</code>). Use <code>SemaphoreSlim(1,1)</code> as an async-compatible mutex, and higher counts to throttle concurrent access to a limited resource (e.g. connection pools).`,

  whyItMatters: `Holding a <code>lock</code> across an <code>await</code> is a common deadlock source in async code. <code>SemaphoreSlim</code> is the correct tool when you need synchronisation that works with async/await without deadlocking or blocking thread pool threads.`,

  prerequisites: ["async-await","threading-basics"],
};
