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
-1`,
  mistakes: [
      "Confusing = (assignment) with == (equality check) inside conditions",
      "Expecting & and | to short-circuit \u2014 use && and || for short-circuit evaluation",
      "Forgetting operator precedence: use parentheses to make intent explicit"
  ],

  difficulty: 'beginner',

  whyItMatters: `Operators are the vocabulary of expressions. Knowing precedence rules and the difference between == and ReferenceEquals prevents subtle bugs that are notoriously hard to track down in production.`,
  related: ["variables-types","control-flow","type-casting"],
  prerequisites: ["variables-types"],
  interviewQ: `What is the difference between <code>==</code> and <code>is</code> when comparing to null?`,
  interviewA: `<code>x == null</code> calls the overloaded <code>==</code> operator, which a type can override — a poorly written type could make <code>obj == null</code> return true even when the object is not null. <code>x is null</code> uses a constant pattern match which always checks identity and cannot be overridden. Prefer <code>is null</code> and <code>is not null</code> in C# 9+ for null checks — they are always correct and communicate intent more clearly than <code>!= null</code>.`
};
