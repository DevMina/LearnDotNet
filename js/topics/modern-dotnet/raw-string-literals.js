export default {
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
}`
};
