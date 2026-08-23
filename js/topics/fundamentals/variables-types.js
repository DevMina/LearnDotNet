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
Score has value: False`,
  mistakes: [
      "Using var and assuming it means dynamic \u2014 var is still statically typed at compile time",
      "Comparing strings with == on reference types from different sources \u2014 use string.Equals or == which is overloaded for string",
      "Forgetting that integer division truncates: 5 / 2 == 2, not 2.5"
  ],

  difficulty: 'beginner',

  whyItMatters: `Static typing catches entire classes of bugs at compile time that dynamic languages only surface at runtime. Understanding value vs reference types is essential for reasoning about performance, copying semantics, and equality throughout your C# career.`,
  related: ["operators","control-flow","nullable-value-types","boxing-unboxing"],
  interviewQ: `What is the difference between a value type and a reference type in C#?`,
  interviewA: `Value types (<code>int</code>, <code>bool</code>, <code>struct</code>) store their data directly — assigning one variable to another copies the value. Reference types (<code>class</code>, <code>string</code>, <code>array</code>) store a reference to heap memory — assigning copies the reference, not the data, so both variables point to the same object. Key implications: value types are typically stack-allocated (though they can live on the heap inside a class); reference types always live on the heap and are garbage collected; comparing value types with <code>==</code> compares content, while reference types compare identity by default unless overridden.`
};
