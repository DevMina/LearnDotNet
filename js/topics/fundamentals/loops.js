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
  ],

  difficulty: 'beginner',

  whyItMatters: `Knowing when to prefer foreach over for, and when to reach for LINQ instead of any loop, separates readable C# from imperative spaghetti.`,
  interviewQ: `When would you use a <code>for</code> loop instead of <code>foreach</code> in C#?`,
  interviewA: `Use <code>for</code> when you need the index, need to iterate in reverse, need to skip elements non-sequentially, or need to modify the collection while iterating (over an array or list by index). Use <code>foreach</code> for all other cases — it works with any <code>IEnumerable&lt;T&gt;</code>, is harder to get wrong (no off-by-one errors), and is more idiomatic C#. Use <code>while</code> when the exit condition is not index-based (e.g. reading lines until EOF). LINQ is often preferable to both when the goal is filtering or transforming rather than iterating with side effects.`,
  related: ["control-flow","arrays-collections","linq","iterators-yield"],
  prerequisites: ["control-flow"]
};
