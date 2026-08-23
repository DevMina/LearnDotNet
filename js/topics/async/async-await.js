export default {
  tagline: "Non-blocking code that reads like synchronous code.",
  explanation: `
          <p>Marking a method <strong>async</strong> lets you use <strong>await</strong> inside it to pause execution until a <em>Task</em> completes — without blocking the calling thread. This is essential for I/O-bound work like network calls or file access, where blocking a thread while waiting would waste resources.</p>
          <p>An async method typically returns <em>Task</em> or <em>Task&lt;T&gt;</em> rather than <em>void</em>, so callers can await it and observe exceptions properly.</p>
        `,
  keyPoints: [
  "await frees the thread while waiting, it does not block it",
  "Async methods should return Task or Task<T>, avoid async void",
  "Exceptions inside an async method surface when the Task is awaited"
],
  code: `async Task<string> FetchGreetingAsync()
{
    await Task.Delay(100); // simulates network latency
    return "Hello from the server";
}

var result = await FetchGreetingAsync();
Console.WriteLine(result);`,
  output: `Hello from the server`,
  prerequisites: ["delegates-events","methods-parameters"],
  mistakes: [
      "async void \u2014 exceptions are unobservable and crash the process; always use async Task",
      "Blocking on async code with .Result or .Wait() \u2014 deadlocks in contexts with a synchronisation context",
      "Forgetting to await a Task \u2014 the call returns immediately and the error is silently swallowed"
  ],
  interviewQ: `What is the difference between <code>Task</code> and <code>ValueTask</code>?`,
  interviewA: `<code>Task</code> is a class (reference type) always allocated on the heap. <code>ValueTask</code> is a struct that avoids heap allocation when the result is already available synchronously (common in caching scenarios). Use <code>Task</code> by default; switch to <code>ValueTask</code> only when profiling shows allocation pressure in a hot path. Never <code>await</code> a <code>ValueTask</code> more than once — it is not safe to do so.`,
  whyItMatters: `Async/await is essential for building responsive UIs, high-throughput web APIs, and I/O-bound services. Understanding how it works under the hood — state machines, context capture, ConfigureAwait — prevents the subtle bugs (deadlocks, context switching overhead) that trip up developers who treat it as magic.`,
  related: ["cancellation-token","valuetask","tpl","threading-basics","async-streams"],
  difficulty: 'intermediate'
};
