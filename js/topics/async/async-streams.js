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
  related: ["channels"]
};
