export default {
  difficulty: 'beginner',
  tagline: "const is a compile-time literal; readonly is set once at construction time.",
  explanation: `
    <p><strong>const</strong> must be assigned a compile-time constant (a literal or an expression of literals). The compiler inlines the value everywhere it is used — the field itself does not exist at runtime. This makes <code>const</code> fast but inflexible: changing its value is a breaking change for any assembly that was compiled against it.</p>
    <p><strong>readonly</strong> is evaluated at runtime. It can be set in a constructor (including static constructors), so it can hold complex values like <code>new List&lt;string&gt;</code>. <code>static readonly</code> is the correct pattern for constants that are not primitive literals or that might change between deployments.</p>
  `,
  keyPoints: [
    'const: compile-time only; limited to primitive types and string; inlined by the compiler',
    'readonly: set once, at field initialisation or in a constructor; any type allowed',
    'static readonly is the safer choice for public API constants — callers do not need to recompile when you change the value',
    'readonly does not make referenced objects immutable — a readonly List<T> can still be modified',
    'record types with init-only properties are the modern way to model immutable data',
  ],
  code: `// const — compile-time, primitives and string only
public const double Pi = 3.14159265358979;
public const string AppName = "LearnDotNet";

// readonly — runtime, any type, set in constructor
public class Config {
    public readonly DateTime StartedAt = DateTime.UtcNow;
    public readonly IReadOnlyList<string> AllowedRoles;

    public Config(IEnumerable<string> roles) {
        AllowedRoles = roles.ToList();
    }
}

// static readonly — better than const for public API values
public static readonly Version MinVersion = new Version(3, 1);

// Common trap: readonly ≠ deep immutability
public readonly List<int> Scores = new List<int>();
Scores.Add(99);  // allowed — List contents are still mutable
// Scores = new List<int>(); // ← compiler error: reassignment blocked`,
  output: `// No runtime output — these are declarations.
// Pi inlined as 3.14159... wherever used.`,
  prerequisites: ['variables-types', 'classes-objects'],
  mistakes: [
    'Using const for values that might change (e.g. version numbers, URLs) — callers need to recompile',
    'Assuming readonly makes the object itself immutable — it only prevents reassignment of the field',
    'Using a static readonly field where a const would work — const is fine for truly permanent values like Math.PI',
  ],
  related: ['variables-types', 'structs', 'records'],
  interviewQ: 'When would you choose <code>static readonly</code> over <code>const</code>?',
  interviewA: 'Use <code>static readonly</code> when: the value is not a primitive literal (e.g. <code>new Version(1,0)</code>); you want callers to pick up the new value without recompiling (const is inlined at the call site, so changing a public const is a binary-breaking change); or the value is computed at startup. Use <code>const</code> only for truly invariant primitive values where inlining is desirable — mathematical constants, fixed string tokens.',
  whyItMatters: 'Choosing the wrong keyword creates subtle bugs. A public <code>const</code> changed between library versions silently retains the old value in consumers until they recompile. <code>static readonly</code> avoids this and supports richer types, making it the safer default for anything beyond a true mathematical constant.',
};
