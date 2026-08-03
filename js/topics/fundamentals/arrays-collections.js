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
Grace is 34`
};
