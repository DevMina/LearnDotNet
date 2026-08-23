export default {
  versionLabel: "C# 9",
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
  related: ["init-only-properties", "object-initializers", "json-serialization"],
  prerequisites: ["classes-objects","init-only-properties"],
  mistakes: [
      "Mutating a record through a property with a public set \u2014 records are value-semantic by convention, not enforcement",
      "Using records for entities with identity (database rows) \u2014 records compare by value, not by id",
      "Forgetting that with-expressions create a new instance \u2014 the original is unchanged"
  ],
  interviewQ: `When would you choose a record over a class in C#?`,
  interviewA: `Use a <code>record</code> when your type represents data rather than identity — i.e. two instances with the same property values should be considered equal. Records give you value-based equality, a generated <code>ToString()</code>, and <code>with</code> expressions for non-destructive mutation, all for free. Use a <code>class</code> when you need reference equality, mutable state, or complex inheritance. A common pattern: records for DTOs, API responses, and domain value objects; classes for services, repositories, and entities.`,
  whyItMatters: `Records eliminate the boilerplate of value-based equality — no more manually overriding Equals, GetHashCode, and ToString. They are the correct default for DTOs, API responses, and domain value objects in modern C#.`,
  difficulty: 'beginner'
};
