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
  related: ["nullable-reference-types"]
};
