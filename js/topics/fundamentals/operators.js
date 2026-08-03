export default {
  tagline: "Arithmetic, logical, and null-handling operators.",
  explanation: `
          <p>C# supports the usual arithmetic and comparison operators, plus a few that make null-handling much less verbose. The <strong>null-coalescing operator</strong> (<em>??</em>) supplies a fallback value when the left side is null, and <strong>??=</strong> assigns only if the variable is currently null.</p>
          <p>The <strong>null-conditional operator</strong> (<em>?.</em>) short-circuits to null instead of throwing when you access a member on a null reference — extremely common when working with data that may be missing.</p>
        `,
  keyPoints: [
  "?? returns a fallback when the left operand is null",
  "?. safely navigates a possibly-null reference",
  "Compound assignment operators (+=, -=) mutate in place"
],
  code: `string? city = null;
string display = city ?? "Unknown city";

Person? person = null;
int? nameLength = person?.Name?.Length;

Console.WriteLine(display);
Console.WriteLine(nameLength ?? -1);

record Person(string Name);`,
  output: `Unknown city
-1`
};
