export default {
  tagline: "await foreach over a sequence produced asynchronously, one item at a time.",
  explanation: `
          <p><strong>IAsyncEnumerable&lt;T&gt;</strong> combines <em>yield return</em> with <em>async</em>, letting a method produce items one at a time where producing each item involves an async operation, like a paged API call. The consumer uses <strong>await foreach</strong> to process each item as it arrives, instead of waiting for the entire sequence to be ready first.</p>
          <p>This is ideal for streaming results without loading everything into memory up front.</p>
        `,
  keyPoints: [
  "Declared as async IAsyncEnumerable<T> and uses yield return inside",
  "Consumed with await foreach, not a plain foreach",
  "Ideal for streaming results (e.g. paged API responses) instead of loading everything into memory first"
],
  code: `async IAsyncEnumerable<int> GetNumbersAsync()
{
    for (int i = 1; i <= 3; i++)
    {
        await Task.Delay(10);
        yield return i * i;
    }
}

await foreach (var n in GetNumbersAsync())
    Console.WriteLine(n);`,
  output: `1
4
9`,
  related: ["channels"],
  mistakes: [
      "Forgetting await before foreach when consuming an IAsyncEnumerable \u2014 won't compile, but the error message is confusing",
      "Not passing CancellationToken to the async stream \u2014 use WithCancellation() on the foreach",
      "Materialising the entire async stream into a list before processing \u2014 defeats the purpose of streaming"
  ],

  difficulty: 'advanced',

  interviewQ: `What is the difference between <code>IAsyncEnumerable&lt;T&gt;</code> and returning a <code>Task&lt;IEnumerable&lt;T&gt;&gt;</code>?`,

  interviewA: `<code>Task&lt;IEnumerable&lt;T&gt;&gt;</code> waits for all items to be produced before returning any — the entire sequence must be in memory at once. <code>IAsyncEnumerable&lt;T&gt;</code> streams items one at a time using <code>await foreach</code>, so the consumer can process each item as it arrives without waiting for the rest. This is critical for large result sets (database queries via EF Core, streaming AI responses, reading large files) where buffering everything would exhaust memory or add unnecessary latency.`,

  whyItMatters: `Async streams combine the memory efficiency of lazy iteration with the correctness of async I/O. They are the idiomatic way to stream data from databases, files, or APIs without holding everything in memory simultaneously.`,

  prerequisites: ["async-await","iterators-yield"],
};
