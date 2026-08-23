export default {
  versionLabel: "C# 7+",
  tagline: "Testing shape and structure, not just equality.",
  explanation: `
          <p>Pattern matching goes beyond checking if a value equals something — it can test a value's <strong>type</strong>, its <strong>properties</strong>, and its <strong>shape</strong> all in one expression. Combined with switch expressions, this replaces a lot of nested if/else type-checking code.</p>
          <p><strong>Property patterns</strong> (matching on an object's field values) and <strong>relational patterns</strong> (&lt;, &gt;=, etc.) can be combined for expressive, readable conditions.</p>
        `,
  keyPoints: [
  "Type patterns test and cast in a single step: obj is string s",
  "Property patterns match on an object’s field values directly",
  "Combines cleanly with switch expressions for multi-branch logic"
],
  code: `record Shape(string Kind, double Radius);

string Describe(Shape s) => s switch
{
    { Kind: "circle", Radius: > 5 } => "Large circle",
    { Kind: "circle" }              => "Circle",
    { Kind: "square" }               => "Square",
    _                                => "Unknown shape"
};

Console.WriteLine(Describe(new Shape("circle", 4)));
Console.WriteLine(Describe(new Shape("circle", 9)));`,
  output: `Circle
Large circle`,
  related: ["regular-expressions"],
  prerequisites: ["control-flow","inheritance"],
  mistakes: [
      "Using patterns in if-chains instead of switch expressions when all cases are known \u2014 switch expressions are exhaustive and cleaner",
      "Forgetting that when guards run after the pattern matches \u2014 the variable is in scope inside the guard",
      "Using is Type x and then immediately casting again \u2014 the variable x already holds the cast value"
  ],
  difficulty: 'intermediate',
  whyItMatters: `Pattern matching replaces verbose if/else chains and explicit type casts with concise, exhaustive switch expressions. It is fundamental to discriminated-union patterns in C# and makes null handling, type dispatch, and structural decomposition dramatically more readable.`,
  interviewQ: `What is the difference between a switch statement and a switch expression in C#?`,
  interviewA: `A switch <em>statement</em> transfers control to one of several branches and executes statements — it has no value. A switch <em>expression</em> (C# 8+) produces a value, is exhaustive (the compiler warns if a case is unhandled), and uses <code>=&gt;</code> arms instead of <code>case/break</code>. Switch expressions also support pattern matching arms: type patterns, property patterns, relational patterns, and when guards — making them far more powerful than the traditional statement form.`
};
