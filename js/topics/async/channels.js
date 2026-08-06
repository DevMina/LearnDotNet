export default {
  tagline: "A thread-safe queue built for async producer/consumer code.",
  explanation: `
          <p><strong>System.Threading.Channels</strong> provides <em>Channel&lt;T&gt;</em>, an async-first queue for passing data between a producer and one or more consumers without manual locking. A writer calls <em>WriteAsync</em>, and a reader awaits items with <em>ReadAllAsync</em>, which naturally backs off when the channel is empty.</p>
          <p>Bounded channels can also apply <strong>backpressure</strong> — if the channel is full, <em>WriteAsync</em> waits, which keeps a fast producer from overwhelming a slower consumer.</p>
        `,
  keyPoints: [
  "Channel<T> is a thread-safe, async-friendly producer/consumer queue",
  "ReadAllAsync() as an await foreach consumes items as they arrive",
  "Bounded channels apply backpressure, pausing writers when the buffer is full"
],
  code: `using System.Threading.Channels;

var channel = Channel.CreateUnbounded<int>();

async Task ProduceAsync()
{
    for (int i = 1; i <= 3; i++)
        await channel.Writer.WriteAsync(i);
    channel.Writer.Complete();
}

async Task ConsumeAsync()
{
    await foreach (var item in channel.Reader.ReadAllAsync())
        Console.WriteLine($"Received {item}");
}

await Task.WhenAll(ProduceAsync(), ConsumeAsync());`,
  output: `Received 1
Received 2
Received 3`,
  related: ["tpl", "async-streams"],
  mistakes: [
      "Not completing the writer \u2014 ReadAllAsync waits forever if Complete() is never called",
      "Ignoring the return value of TryWrite on a bounded channel \u2014 it returns false when full, data is silently dropped",
      "Using an unbounded channel with a fast producer \u2014 memory grows without limit; prefer bounded with backpressure"
  ]
};
