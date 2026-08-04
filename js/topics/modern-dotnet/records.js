export default {
  tagline: "Immutable, value-based data types with almost no boilerplate.",
  explanation: `
          <p>A <strong>record</strong> is designed for modeling immutable data. It gets value-based equality (two records are equal if their properties match, unlike classes which compare references), a generated <em>ToString()</em>, and a compact constructor syntax for free.</p>
          <p><strong>with</strong> expressions create a modified copy without mutating the original — useful for immutable update patterns common in functional-style code.</p>
        `,
  keyPoints: [
  "Records compare by value, classes compare by reference by default",
  "with expressions produce a copy with specific properties changed",
  "Best suited to data that represents a snapshot rather than a mutable entity"
],
  code: `public record Point(int X, int Y);

var p1 = new Point(1, 2);
var p2 = p1 with { Y = 9 };

Console.WriteLine(p1);
Console.WriteLine(p2);
Console.WriteLine(p1 == new Point(1, 2));`,
  output: `Point { X = 1, Y = 2 }
Point { X = 1, Y = 9 }
True`,
  related: ["init-only-properties", "object-initializers", "json-serialization"]
};
