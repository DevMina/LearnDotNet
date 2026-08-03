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
  output: `Hello from the server`
};
