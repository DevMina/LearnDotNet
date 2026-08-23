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
  output: `30, 32, 46, 84`,
  prerequisites: ["arrays-collections","delegates-events"],
  mistakes: [
      "Forgetting that LINQ queries are lazy \u2014 the query runs each time you enumerate it, not when you define it",
      "Calling .ToList() prematurely and materialising a large set before filtering it",
      "Throwing exceptions inside a Select \u2014 the exception surfaces at enumeration, not at the Select call"
  ],
  interviewQ: `What is the difference between <code>IEnumerable&lt;T&gt;</code> and <code>IQueryable&lt;T&gt;</code>?`,
  interviewA: `<code>IEnumerable&lt;T&gt;</code> processes data in memory using LINQ-to-Objects — all filtering and projection happen in C# after the data is fetched. <code>IQueryable&lt;T&gt;</code> translates LINQ operators into the data source's native query language (e.g. SQL) so that filtering happens at the source before data is transferred. Calling <code>.AsEnumerable()</code> on a queryable switches to in-memory processing from that point on.`,
  whyItMatters: `LINQ turns collection processing into a declarative style that is easier to read, compose, and refactor. It is used in almost every C# codebase — for in-memory data, for databases via EF Core, for XML, and more.`,
  related: ["arrays-collections","generics","ienumerable-iqueryable","expression-trees"],
  difficulty: 'intermediate'
};
