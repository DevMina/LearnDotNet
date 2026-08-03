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
5`
};
