export default {
  versionLabel: "C# 11",
  tagline: "Embed quotes and backslashes without escaping (C# 11).",
  explanation: `
          <p>A <strong>raw string literal</strong>, delimited by three or more double quotes, lets you embed characters like <em>"</em> and <em>\\</em> literally, with no escape sequences needed — especially useful for JSON, regex patterns, and file paths.</p>
          <p>Combine it with <em>$</em> for a raw interpolated string (<em>$"""..."""</em>) to get all the benefits of interpolation without fighting escape characters.</p>
        `,
  keyPoints: [
  "Delimited by three or more consecutive double quotes",
  "Contents are taken completely literally — no escaping needed for \" or \\\\",
  "Combine with $ for raw interpolated strings: $\"\"\"...{expr}...\"\"\""
],
  code: `string json = """
{
  "name": "Ada",
  "path": "C:\\Users\\Ada"
}
""";

Console.WriteLine(json);`,
  output: `{
  "name": "Ada",
  "path": "C:\\Users\\Ada"
}`,
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ],
  difficulty: 'beginner',
  whyItMatters: `Raw string literals eliminate escape sequences from embedded JSON, SQL, regex, and HTML. The result is copy-pasteable content that exactly matches the source without transformation noise — and is far easier to read in code review.`,
  interviewQ: `When should you use a raw string literal over a verbatim string (@"...")?`,
  interviewA: `Use raw string literals (<code>"""..."""</code>) when you need embedded quotes, backslashes without escaping, or multiline content with controlled indentation. Verbatim strings (<code>@"..."</code>) still need <code>""</code> to represent a quote inside them. Raw strings allow any number of quotes inside as long as the delimiter has more consecutive quotes than the content — and C# 11 raw strings can include interpolated expressions without escaping curly braces.`,
  related: ["string-interpolation","json-serialization"],
  prerequisites: ["string-interpolation"]
};
