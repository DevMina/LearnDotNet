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
  related: ["pattern-matching", "string-interpolation"],
  mistakes: [
      "Using catastrophic backtracking patterns \u2014 nested quantifiers on overlapping character classes can hang the process",
      "Recompiling a Regex on every call \u2014 use a static [GeneratedRegex] or a static Regex instance instead",
      "Not anchoring the pattern \u2014 a match anywhere in the string when you meant the whole string"
  ],

  difficulty: 'intermediate',

  whyItMatters: `Regular expressions handle text pattern problems in a single expression that would otherwise require dozens of lines of parsing code. In .NET, the source-generated <code>[GeneratedRegex]</code> attribute compiles the pattern at build time, giving you both convenience and runtime performance.`,

  prerequisites: ["methods-parameters"],
  interviewQ: `What is the advantage of <code>[GeneratedRegex]</code> over <code>new Regex(pattern)</code> in .NET 7+?`,
  interviewA: `<code>[GeneratedRegex]</code> compiles the pattern to a C# state machine at build time — no runtime parsing, no heap allocation for the <code>Regex</code> object, and no JIT compilation on first use. It is also AOT-compatible (important for NativeAOT), enables Roslyn to validate the pattern at compile time, and is typically 2–5× faster than a dynamically created Regex. The only limitation: the pattern must be a compile-time constant.`
};
