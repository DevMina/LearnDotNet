export default {
  tagline: "Pattern-match and extract text with the Regex class.",
  explanation: `
          <p>The <strong>System.Text.RegularExpressions</strong> namespace exposes the <em>Regex</em> class for pattern matching: testing whether a string matches a pattern, extracting captured groups, or replacing matched text.</p>
          <p>Since .NET 7, the <strong>[GeneratedRegex]</strong> source generator can produce a compiled, AOT-friendly regex at build time instead of parsing the pattern at runtime — faster for patterns used repeatedly, such as validating input in a hot path.</p>
        `,
  keyPoints: [
  "Regex.IsMatch tests, Match/Matches extract, Regex.Replace substitutes",
  "Named groups (?<year>\\d{4}) make extracted captures easier to read",
  "[GeneratedRegex] compiles the pattern at build time for better performance"
],
  code: `using System.Text.RegularExpressions;

string text = "Order #4821 placed on 2026-01-15";
var match = Regex.Match(text, @"#(?<id>\\d+).*(?<date>\\d{4}-\\d{2}-\\d{2})");

if (match.Success)
{
    Console.WriteLine($"Order {match.Groups["id"].Value}");
    Console.WriteLine($"Date {match.Groups["date"].Value}");
}`,
  output: `Order 4821
Date 2026-01-15`,
  related: ["pattern-matching", "string-interpolation"]
};
