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
  related: ["regular-expressions"]
};
