export default {
  tagline: "Implicit vs. explicit conversion, and safely checking types with is/as.",
  explanation: `
          <p>Conversions that can't lose data (<em>int</em> to <em>long</em>) happen <strong>implicitly</strong>. Conversions that might lose data (<em>double</em> to <em>int</em>) require an <strong>explicit cast</strong> — you're telling the compiler you accept the risk.</p>
          <p>The <strong>as</strong> operator attempts a reference conversion and returns <em>null</em> on failure instead of throwing. <strong>is</strong> checks a type without converting at all, and can bind the result to a new variable in the same expression.</p>
        `,
  keyPoints: [
  "Implicit conversions never lose data; explicit casts might, so the compiler requires you to opt in",
  "as returns null on failure instead of throwing an exception",
  "is pattern-matches a type and can bind the result to a new variable in one step"
],
  code: `double price = 19.99;
int rounded = (int)price;

object obj = "hello";
string? asString = obj as string;
object number = 42;
string? asFailed = number as string;

Console.WriteLine(rounded);
Console.WriteLine(asString);
Console.WriteLine(asFailed ?? "null");

if (obj is string s)
    Console.WriteLine($"Length: {s.Length}");`,
  output: `19
hello
null
Length: 5`
};
