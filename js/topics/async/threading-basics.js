export default {
  tagline: "Shared state needs coordination.",
  explanation: `
          <p>When multiple threads write to shared state, you need synchronization to avoid race conditions — two threads reading-then-writing the same variable can lose an update. The <strong>lock</strong> keyword ensures only one thread executes a block at a time.</p>
          <p>For simple counters, <strong>Interlocked</strong> operations are faster than a full lock, performing the increment atomically at the hardware level.</p>
        `,
  keyPoints: [
  "lock prevents two threads from entering the same block simultaneously",
  "Interlocked.Increment is a lightweight atomic alternative for simple counters",
  "Unsynchronized shared state is a common source of subtle, hard-to-reproduce bugs"
],
  code: `int counter = 0;
object gate = new();

void Increment()
{
    lock (gate)
    {
        counter++;
    }
}

Parallel.For(0, 1000, _ => Increment());
Console.WriteLine($"Final count: {counter}");`,
  output: `Final count: 1000`,
  related: ["semaphore-slim"],
  mistakes: [
      "Accessing shared state from multiple threads without synchronisation \u2014 data races cause silent corruption",
      "Using Thread.Sleep for timing \u2014 it blocks the thread; use Task.Delay in async code",
      "Creating threads directly instead of using the thread pool via Task.Run \u2014 wastes resources on short-lived work"
  ],

  difficulty: 'advanced',

  interviewQ: `What is the difference between a thread and a Task in .NET?`,

  interviewA: `A <code>Thread</code> is an OS-level thread — expensive to create (~1MB stack), and the OS scheduler decides when it runs. A <code>Task</code> is a unit of work scheduled on the thread pool — lightweight, reuses threads, and can represent async I/O without tying up a thread at all. Creating one <code>Task</code> per request in a web server works fine; creating one <code>Thread</code> per request would exhaust system resources at scale. Prefer <code>Task</code> and async/await; use <code>Thread</code> only when you need explicit control over thread priority, name, or apartment state.`,

  whyItMatters: `Conflating threads and tasks is the most common source of async performance problems and deadlocks. Understanding that async I/O releases the thread pool thread while waiting — making the server able to serve other requests — is the key insight that makes async architecture valuable.`,

  prerequisites: ["async-await"],
};
