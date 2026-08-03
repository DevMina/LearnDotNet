export default {
  tagline: "C# is statically typed — every variable has a type known at compile time.",
  explanation: `
          <p>Every variable in C# is declared with a type, and the compiler checks that type at build time rather than at runtime. This catches a whole category of bugs before your program ever runs. You can either name the type explicitly (<strong>int</strong>, <strong>string</strong>, <strong>bool</strong>) or let the compiler infer it with <strong>var</strong> — the type is still fixed once assigned, <strong>var</strong> just saves you typing it out.</p>
          <p>C# distinguishes <strong>value types</strong> (like <em>int</em>, <em>double</em>, <em>struct</em>), which hold their data directly, from <strong>reference types</strong> (like <em>string</em>, <em>class</em>), which hold a pointer to data elsewhere. This distinction affects how copying and comparison behave.</p>
        `,
  keyPoints: [
  "var infers the type at compile time — it is not dynamic typing",
  "Value types are copied by value; reference types are copied by reference",
  "Nullable value types use a ? suffix, e.g. int?"
],
  code: `int age = 29;
double price = 19.99;
string name = "Ada";
var isActive = true;          // inferred as bool
int? score = null;            // nullable value type

Console.WriteLine($"{name} is {age}, active: {isActive}");
Console.WriteLine($"Score has value: {score.HasValue}");`,
  output: `Ada is 29, active: True
Score has value: False`
};
