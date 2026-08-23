export default {
  tagline: "ref, out, in, optional parameters, and overloading.",
  explanation: `
          <p>Parameters pass by value by default — the method gets its own copy. <strong>ref</strong> lets a method modify the caller's variable directly, <strong>out</strong> is similar but doesn't require the caller to initialize the variable first (it must be assigned inside the method), and <strong>in</strong> passes by reference as read-only, avoiding a copy for large structs without allowing mutation.</p>
          <p><strong>Optional parameters</strong> let callers omit arguments that have a default value, and <strong>method overloading</strong> lets you define several methods with the same name distinguished by their parameter list.</p>
        `,
  keyPoints: [
  "ref requires the caller’s variable to already have a value; out does not, but must be assigned inside the method",
  "in passes by reference but prevents the method from modifying the argument",
  "Overloads are distinguished by parameter type/count, not by return type alone"
],
  code: `void Increment(ref int value) => value++;

bool TryDivide(int a, int b, out int result)
{
    if (b == 0) { result = 0; return false; }
    result = a / b;
    return true;
}

int x = 5;
Increment(ref x);
Console.WriteLine(x);

if (TryDivide(10, 2, out int quotient))
    Console.WriteLine(quotient);`,
  output: `6
5`,
  related: ["method-overloading"],
  mistakes: [
      "Forgetting that params creates an array \u2014 calling with no args passes an empty array, not null",
      "Overusing ref and out when simply returning a value or tuple is cleaner",
      "Optional parameters with default values are baked into the call site at compile time \u2014 changing them requires recompiling all callers"
  ],

  difficulty: 'beginner',

  whyItMatters: `Understanding parameter passing semantics — especially ref, out, and in — prevents subtle aliasing bugs. Method signature design (named parameters, optional defaults, params) makes APIs cleaner and easier to call correctly.`,
  interviewQ: `What is the difference between named and optional parameters, and when should you avoid them?`,
  interviewA: `Optional parameters have a default value declared at the call site: <code>void Log(string msg, bool timestamp = true)</code>. Named parameters let callers specify which parameter they are providing: <code>Log(msg: "hi", timestamp: false)</code>. Avoid optional parameters in public library APIs: the default value is baked into every call site at compile time — changing it is a binary-breaking change. Prefer overloads for public APIs and reserve optional parameters for internal or private methods.`,
  prerequisites: ["variables-types","control-flow"]
};
