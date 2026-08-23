export default {
  tagline: "Building readable strings with $\"...\" and format specifiers.",
  explanation: `
          <p><strong>String interpolation</strong> (<em>$"..."</em>) embeds expressions directly inside a string literal, replacing verbose <em>string.Format</em> calls or concatenation. Any expression can go inside the braces, not just a variable name.</p>
          <p><strong>Format specifiers</strong> after a colon control exactly how a value renders — <em>:C</em> for currency, <em>:F2</em> for two decimal places, <em>:yyyy-MM-dd</em> for a date pattern.</p>
        `,
  keyPoints: [
  "Any expression can go inside the { } of an interpolated string, not just a variable",
  "Format specifiers (:C, :F2, :N0, :yyyy-MM-dd) control the exact rendering",
  "Raw string literals (\"\"\"...\"\"\"), covered separately, pair well with interpolation for multi-line text"
],
  code: `decimal price = 1234.5m;
int quantity = 3;
var date = new DateTime(2026, 8, 3);

Console.WriteLine($"{quantity} items at {price:C} each = {price * quantity:C}");
Console.WriteLine($"Date: {date:yyyy-MM-dd}");`,
  output: `3 items at $1,234.50 each = $3,703.50
Date: 2026-08-03`,
  related: ["regular-expressions"],
  mistakes: [
      "Using string concatenation in a loop \u2014 use StringBuilder or string.Join for many concatenations",
      "Forgetting culture sensitivity: $\"{price}\" uses the current culture; use .ToString(\"C\", culture) for display",
      "Embedding complex expressions in interpolation \u2014 extract to a variable first for readability"
  ],

  difficulty: 'beginner',

  whyItMatters: `String interpolation is the readable, type-safe alternative to string.Format. In .NET 6+, the compiler optimises interpolated strings with <code>DefaultInterpolatedStringHandler</code> to avoid intermediate allocations — making them fast as well as readable.`,
  interviewQ: `How does the C# compiler optimise interpolated strings in .NET 6+?`,
  interviewA: `In .NET 6+, the compiler transforms interpolated strings into a sequence of <code>DefaultInterpolatedStringHandler</code> method calls instead of calling <code>string.Format</code>. The handler appends each literal segment and formatted value to a pooled <code>StringBuilder</code>-like buffer — avoiding the intermediate argument array that <code>Format</code> requires and reducing heap allocations. In .NET 8+, constant expressions in interpolated strings are folded to string constants at compile time. The result is that <code>$"Hello {name}"</code> is typically faster and produces less GC pressure than the equivalent <code>string.Format</code> call.`,
  prerequisites: ["variables-types"]
};
