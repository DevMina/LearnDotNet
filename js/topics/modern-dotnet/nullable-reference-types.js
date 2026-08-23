export default {
  versionLabel: "C# 8",
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
Hello, Priya`,
  related: ["nullable-value-types"],
  prerequisites: ["nullable-value-types","classes-objects"],
  mistakes: [
      "Suppressing warnings with ! without understanding why the compiler thinks something could be null",
      "Enabling nullable in a project that doesn't have null guards everywhere \u2014 a flood of warnings that get ignored",
      "Confusing nullable reference types (compile-time check) with nullable value types (runtime Nullable<T>)"
  ],
  interviewQ: `What is the difference between a nullable value type (<code>int?</code>) and a nullable reference type (<code>string?</code>)?`,
  interviewA: `A nullable value type (<code>int?</code>, <code>Nullable&lt;int&gt;</code>) genuinely wraps a value that may or may not be present at runtime — it has <code>.HasValue</code> and <code>.Value</code> properties. A nullable reference type (<code>string?</code>) is purely a compile-time annotation — the question mark tells the compiler "this may be null, emit a warning if you see it dereferenced without a null check." At runtime <code>string?</code> and <code>string</code> are identical types.`,
  whyItMatters: `Nullable reference types surface null-dereference bugs at compile time rather than as NullReferenceException at runtime. Enabling them is one of the highest-value static-analysis investments you can make in a C# codebase.`,
  difficulty: 'intermediate'
};
