export default {
  tagline: "Fixed-size arrays vs. resizable List<T> and Dictionary<K,V>.",
  explanation: `
          <p>Arrays have a fixed length set at creation. <strong>List&lt;T&gt;</strong> from <em>System.Collections.Generic</em> wraps an array internally but resizes automatically as you add items, making it the default choice for most collections.</p>
          <p><strong>Dictionary&lt;TKey, TValue&gt;</strong> stores key-value pairs with near-constant-time lookups, ideal whenever you need to look something up by a unique key rather than scan a list.</p>
        `,
  keyPoints: [
  "List<T> grows dynamically; arrays do not",
  "Dictionary<K,V> lookups are much faster than scanning a List for a match",
  "Both implement IEnumerable<T>, so foreach works on either"
],
  code: `var scores = new List<int> { 90, 85, 77 };
scores.Add(99);

var ages = new Dictionary<string, int>
{
    ["Ada"] = 29,
    ["Grace"] = 34
};

Console.WriteLine($"Scores: {string.Join(", ", scores)}");
Console.WriteLine($"Grace is {ages["Grace"]}");`,
  output: `Scores: 90, 85, 77, 99
Grace is 34`,
  mistakes: [
      "Accessing an index that doesn't exist \u2014 always check Count/Length or use TryGetValue",
      "Confusing List<T> (resizable) with arrays (fixed size) \u2014 most code should prefer List<T>",
      "Adding to a collection while iterating over it \u2014 collect changes and apply after the loop"
  ],

  difficulty: 'beginner',

  interviewQ: `What is the difference between an array and a List<T> in C#?`,

  interviewA: `An array has a fixed size set at creation time and lives on the heap as a contiguous block. <code>List&lt;T&gt;</code> wraps an array internally and resizes automatically — it doubles capacity when full, so amortised addition is O(1). Arrays are faster for indexed reads and have less overhead; <code>List&lt;T&gt;</code> is more convenient when size is not known in advance. For read-only sequences, prefer <code>IReadOnlyList&lt;T&gt;</code> or <code>IEnumerable&lt;T&gt;</code> in your API surface.`,

  whyItMatters: `Collections are the fundamental data structure of nearly every program. Choosing the right one — array, List, Dictionary, HashSet — has direct performance consequences and affects how clearly your intent reads.`,
  related: ["linq","generics","loops","span"],
  prerequisites: ["variables-types","loops"]
};
