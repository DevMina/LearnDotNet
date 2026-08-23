export default {
  tagline: "Let value types represent \"no value\" without a sentinel.",
  explanation: `
          <p>Value types like <em>int</em> or <em>bool</em> can't normally be <em>null</em> — they always hold a value. <strong>Nullable&lt;T&gt;</strong> (written as <em>T?</em>, e.g. <em>int?</em>) wraps a value type so it can also represent "no value", which is common for things like an optional age or a database column that allows NULL.</p>
          <p>Use <em>.HasValue</em> and <em>.Value</em> to check and unwrap safely, the <strong>??</strong> null-coalescing operator to supply a default, or pattern matching. Accessing <em>.Value</em> on a null instance throws <em>InvalidOperationException</em>.</p>
        `,
  keyPoints: [
  "int? is shorthand for Nullable<int>; works for any struct, not just int",
  "HasValue/Value or ?? are the safe ways to read a nullable value type",
  "Distinct from nullable reference types, which apply to classes, not structs"
],
  code: `int? age = null;

Console.WriteLine(age.HasValue);
Console.WriteLine(age ?? -1);

age = 30;
if (age is int a)
{
    Console.WriteLine($"Age is {a}");
}`,
  output: `False
-1
Age is 30`,
  related: ["nullable-reference-types"],
  mistakes: [
      "Accessing .Value without checking .HasValue first \u2014 throws InvalidOperationException if null",
      "Confusing Nullable<T> (value types) with nullable reference types (classes with ?) \u2014 they're different mechanisms",
      "Returning null from a method that callers expect to never be null \u2014 document and enforce the contract"
  ],

  difficulty: 'beginner',

  interviewQ: `How does <code>int?</code> (Nullable<int>) work internally?`,

  interviewA: `<code>int?</code> is syntactic sugar for <code>Nullable&lt;int&gt;</code>, a struct with two fields: <code>bool HasValue</code> and <code>int Value</code>. When <code>HasValue</code> is false, <code>Value</code> is undefined — accessing it throws <code>InvalidOperationException</code>. The <code>??</code> operator returns the right side when the left is null, and <code>?.Value</code> returns null instead of throwing. Crucially, <code>int?</code> is still a value type — it lives on the stack and is never null in the reference sense.`,

  whyItMatters: `Nullable value types represent the absence of a value without resorting to sentinel values like -1 or 0. They are the correct way to model optional data in database rows, optional parameters, and domain concepts like "date of expiry not yet set".`,
  prerequisites: ["variables-types"]
};
