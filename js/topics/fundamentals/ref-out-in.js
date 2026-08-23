export default {
  difficulty: 'intermediate',
  tagline: "Three keywords for passing by reference — each with a different contract.",
  explanation: `
    <p>By default, C# passes arguments <strong>by value</strong> — the method gets a copy. The <code>ref</code>, <code>out</code>, and <code>in</code> keywords pass the <em>variable itself</em> (by reference), so the method can read or write the caller's original storage location.</p>
    <p><strong>ref</strong> — two-way: the caller must initialise the variable first; the method may read and write it.<br>
    <strong>out</strong> — write-only contract: the caller need not initialise; the method <em>must</em> assign before returning. Used when a method produces multiple outputs (<code>int.TryParse</code>).<br>
    <strong>in</strong> (C# 7.2) — read-only reference: the method receives a reference but cannot modify the value. Avoids copying large structs without risk of accidental mutation.</p>
  `,
  keyPoints: [
    'ref: caller initialises first; method can read and write',
    'out: caller need not initialise; method must assign before returning',
    'in: read-only reference; prevents copying large value types',
    'All three avoid copying, but in is the safest — it is a defensive read-only alias',
    'Span<T> and ref struct types build on these same by-reference semantics',
  ],
  code: `// ref — two-way
void Double(ref int x) => x *= 2;
int n = 5;
Double(ref n);
Console.WriteLine(n); // 10

// out — method must assign
bool TryDivide(int a, int b, out double result) {
    if (b == 0) { result = 0; return false; }
    result = (double)a / b;
    return true;
}
if (TryDivide(10, 3, out double r))
    Console.WriteLine(r); // 3.333...

// in — read-only reference (avoids copy of big struct)
readonly struct BigPoint { public double X, Y, Z, W; }
double Length(in BigPoint p) =>
    Math.Sqrt(p.X*p.X + p.Y*p.Y + p.Z*p.Z + p.W*p.W);

var pt = new BigPoint { X=1, Y=2, Z=2, W=0 };
Console.WriteLine(Length(in pt)); // 3`,
  output: `10
3.3333333333333335
3`,
  prerequisites: ['variables-types', 'methods-parameters', 'structs'],
  mistakes: [
    'Forgetting to initialise a ref parameter before the call — compiler error',
    'Not assigning an out parameter on every code path — compiler error',
    'Using ref when out is more appropriate (signalling "I produced this value")',
    'Storing an in parameter in a local variable — that copies it, defeating the purpose',
  ],
  related: ['variables-types', 'structs', 'methods-parameters'],
  interviewQ: 'What is the difference between <code>ref</code> and <code>out</code> parameters?',
  interviewA: 'Both pass by reference so the method can modify the caller\'s variable. The difference is the contract: <code>ref</code> requires the caller to initialise the variable first (the method may or may not change it), while <code>out</code> does not require initialisation and <em>requires</em> the method to assign a value before returning on every code path. Use <code>out</code> to communicate "this method produces a value" — as in <code>TryParse</code> — and <code>ref</code> to communicate "this method modifies an existing value".',
  whyItMatters: 'Ref/out/in unlock performance-critical patterns: returning multiple values without allocating a tuple, modifying large structs without copying, and the TryXxx idiom used throughout the BCL. They are also the foundation of Span<T> and ref struct semantics.',
};
