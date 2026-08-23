export default {
  tagline: "Same method name, different signatures, resolved at compile time.",
  explanation: `
          <p><strong>Method overloading</strong> lets a class expose multiple methods with the same name as long as their parameter lists differ — in number, order, or type. The compiler picks which one to call based on the arguments at the call site, so there's no runtime lookup cost.</p>
          <p>This differs from <strong>overriding</strong> (which changes behavior of an inherited method with the same signature) — overloading changes the signature itself to offer convenient variations of the same operation.</p>
        `,
  keyPoints: [
  "Overloads must differ in parameter type, count, or order — not just return type",
  "Resolved at compile time based on the argument types passed in",
  "Different from overriding, which keeps the same signature across a hierarchy"
],
  code: `int Add(int a, int b) => a + b;
double Add(double a, double b) => a + b;
int Add(int a, int b, int c) => a + b + c;

Console.WriteLine(Add(2, 3));
Console.WriteLine(Add(2.5, 3.5));
Console.WriteLine(Add(1, 2, 3));`,
  output: `5
6
6`,
  related: ["methods-parameters", "operator-overloading"],
  mistakes: [
      "Creating overloads that differ only in optionality \u2014 callers can't tell which one will be called",
      "Overloading with params and a fixed signature of the same arity \u2014 the compiler picks unexpectedly",
      "Changing the behaviour of an overload when callers expect them all to do the same thing, just with different inputs"
  ],

  difficulty: 'beginner',

  whyItMatters: `Overloading gives callers a natural API without forcing them to provide every parameter. It is how the .NET standard library provides both <code>Console.WriteLine(string)</code> and <code>Console.WriteLine(int)</code> without separate names.`,
  interviewQ: `What rules does the C# compiler use to resolve an overloaded method call?`,
  interviewA: `The compiler performs overload resolution: it builds a candidate set of all accessible methods with the right name, then eliminates candidates where the arguments cannot be converted to the parameter types, then picks the "best" match by preferring more specific types (e.g. <code>int</code> over <code>object</code>), exact matches over conversions, and fewer required conversions. If no candidate is best, or two are equally good, the call is ambiguous and is a compile error. Optional parameters and params arrays participate but with lower priority than explicit overloads.`,
  prerequisites: ["methods-parameters","classes-objects"]
};
