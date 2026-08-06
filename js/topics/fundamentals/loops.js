export default {
  tagline: "for, foreach, while, and do-while.",
  explanation: `
          <p><strong>foreach</strong> is the idiomatic way to iterate any <em>IEnumerable</em> — arrays, lists, dictionaries — without managing an index. Use a plain <strong>for</strong> loop when you need the index itself or want to iterate in a non-standard step.</p>
          <p><strong>while</strong> checks its condition before each iteration; <strong>do-while</strong> checks after, guaranteeing the body runs at least once.</p>
        `,
  keyPoints: [
  "foreach cannot modify the collection it is iterating over",
  "break exits a loop entirely; continue skips to the next iteration",
  "do-while always executes its body at least once"
],
  code: `var fruits = new[] { "apple", "kiwi", "mango" };

foreach (var fruit in fruits)
{
    if (fruit == "kiwi") continue;
    Console.WriteLine(fruit);
}

int i = 0;
do
{
    Console.WriteLine($"tick {i}");
    i++;
} while (i < 2);`,
  output: `apple
mango
tick 0
tick 1`,
  mistakes: [
      "Modifying a collection inside a foreach loop \u2014 throws InvalidOperationException at runtime",
      "Off-by-one errors with for loops: using < vs <= for the boundary condition",
      "Using while(true) without a guaranteed exit path, causing an infinite loop"
  ]
};
