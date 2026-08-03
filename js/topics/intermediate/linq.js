export default {
  tagline: "Query collections declaratively, like SQL for in-memory data.",
  explanation: `
          <p><strong>LINQ</strong> (Language Integrated Query) adds query operators like <em>Where</em>, <em>Select</em>, <em>OrderBy</em>, and <em>GroupBy</em> directly onto any <em>IEnumerable&lt;T&gt;</em>. These are lazily evaluated — nothing runs until you actually enumerate the result, e.g. with <em>foreach</em> or <em>.ToList()</em>.</p>
          <p>LINQ works identically over in-memory collections, XML, and (via EF Core) SQL databases, which is why it's worth learning early — the same mental model applies everywhere.</p>
        `,
  keyPoints: [
  "LINQ queries are lazily evaluated until enumerated",
  "Method syntax (.Where().Select()) and query syntax (from...where...select) are equivalent",
  "Works over in-memory collections, XML, and EF Core database queries"
],
  code: `var numbers = new[] { 4, 8, 15, 16, 23, 42 };

var result = numbers
    .Where(n => n > 10)
    .Select(n => n * 2)
    .OrderBy(n => n);

Console.WriteLine(string.Join(", ", result));`,
  output: `30, 32, 46, 84`
};
