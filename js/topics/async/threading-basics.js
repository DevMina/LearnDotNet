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
  ]
};
