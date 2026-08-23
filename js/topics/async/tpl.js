export default {
  tagline: "Running independent work concurrently.",
  explanation: `
          <p><strong>Task.WhenAll</strong> runs multiple independent async operations concurrently and completes once they all finish — much faster than awaiting them one at a time when they don't depend on each other.</p>
          <p>Use <strong>Task.Run</strong> to offload CPU-bound work onto a background thread pool thread; use plain <em>async/await</em> (no Task.Run) for I/O-bound work, since it doesn't need a dedicated thread while waiting.</p>
        `,
  keyPoints: [
  "Task.WhenAll runs independent tasks concurrently, not sequentially",
  "Task.Run is for CPU-bound work; plain async/await suits I/O-bound work",
  "Awaiting tasks one-by-one in a loop loses the concurrency benefit"
],
  code: `async Task<int> SquareAfterDelay(int n)
{
    await Task.Delay(50);
    return n * n;
}

var tasks = new[] { SquareAfterDelay(2), SquareAfterDelay(3), SquareAfterDelay(4) };
var results = await Task.WhenAll(tasks);

Console.WriteLine(string.Join(", ", results));`,
  output: `4, 9, 16`,
  related: ["channels"],
  mistakes: [
      "Using Task.Run for I/O-bound work \u2014 it wastes a thread; use async/await instead",
      "Not handling exceptions from tasks \u2014 unobserved task exceptions used to crash the process (still can in some configs)",
      "Overusing Parallel.ForEach when the work is I/O-bound \u2014 parallelism helps CPU-bound work, not I/O"
  ],

  difficulty: 'advanced',

  interviewQ: `When should you use <code>Parallel.ForEach</code> vs <code>Task.WhenAll</code>?`,

  interviewA: `<code>Parallel.ForEach</code> is for CPU-bound work — it partitions data across thread pool threads and runs them simultaneously. It blocks the calling thread until all partitions complete. <code>Task.WhenAll</code> is for I/O-bound concurrent work — it awaits multiple async operations concurrently without blocking any threads. Using <code>Parallel.ForEach</code> for I/O-bound work wastes thread pool threads. Using <code>Task.WhenAll</code> for pure CPU work inside an async context (e.g. with <code>Task.Run</code>) is correct but adds overhead. When in doubt: I/O → <code>Task.WhenAll</code>, CPU → <code>Parallel</code> or <code>Task.Run</code>.`,

  whyItMatters: `Choosing the wrong concurrency primitive is one of the most common performance mistakes in .NET. CPU-bound work needs real thread parallelism; I/O-bound work needs async concurrency. Mixing them up produces code that is either slower than sequential (async CPU work) or starves the thread pool (sync I/O).`,

  prerequisites: ["async-await","threading-basics"],
};
