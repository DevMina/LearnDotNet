export default {
  tagline: "Letting the compiler catch null-reference bugs before runtime.",
  explanation: `
          <p>With nullable reference types enabled (the default in new projects), <em>string</em> means "never null" while <em>string?</em> explicitly allows null. The compiler then warns you at build time if you dereference something that could be null without checking first.</p>
          <p>This doesn't add a runtime check — it's a compile-time analysis that turns a common source of <em>NullReferenceException</em> crashes into a build warning you see immediately.</p>
        `,
  keyPoints: [
  "string means non-null, string? means nullable, once the feature is enabled",
  "Purely a compile-time warning system, not a runtime guard",
  "Enabled by default in new project templates since .NET 6"
],
  code: `#nullable enable

string GetGreeting(string? name)
{
    if (name is null) return "Hello, stranger";
    return $"Hello, {name}";
}

Console.WriteLine(GetGreeting(null));
Console.WriteLine(GetGreeting("Priya"));`,
  output: `Hello, stranger
Hello, Priya`
};
