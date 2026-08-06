export default {
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
  mistakes: [
      "Using patterns in if-chains instead of switch expressions when all cases are known \u2014 switch expressions are exhaustive and cleaner",
      "Forgetting that when guards run after the pattern matches \u2014 the variable is in scope inside the guard",
      "Using is Type x and then immediately casting again \u2014 the variable x already holds the cast value"
  ]
};
