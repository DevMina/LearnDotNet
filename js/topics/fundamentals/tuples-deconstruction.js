export default {
  tagline: "Group a few values together without declaring a class.",
  explanation: `
          <p><strong>Value tuples</strong> let you return or group multiple values with named elements without declaring a dedicated type — handy for small, internal groupings that don't warrant a full class or record. The syntax <em>(string Name, int Age)</em> gives each element a readable name instead of relying on <em>.Item1</em>, <em>.Item2</em>.</p>
          <p><strong>Deconstruction</strong> unpacks a tuple — or any type with a matching <em>Deconstruct</em> method, including records — into separate variables in one statement.</p>
        `,
  keyPoints: [
  "(string Name, int Age) syntax gives tuple elements meaningful names",
  "Deconstruction works on tuples, records, and any type with a matching Deconstruct method",
  "Prefer a record over a tuple once the grouping has real behavior or is used widely"
],
  code: `(string Name, int Age) GetPerson() => ("Ada", 29);

var (name, age) = GetPerson();
Console.WriteLine($"{name} is {age}");`,
  output: `Ada is 29`,
  mistakes: [
      "Using ValueTuple for public APIs \u2014 named properties on a class or record are far more readable",
      "Forgetting that tuple element names are compile-time only \u2014 they don't survive reflection or serialisation",
      "Deconstructing into too few variables and silently discarding values"
  ],

  difficulty: 'beginner',

  whyItMatters: `Tuples let you return multiple values from a method without defining a dedicated class. Combined with deconstruction, they make splitting data clean and readable. They are also the foundation of pattern matching and positional patterns.`,
  interviewQ: `What is the difference between <code>System.Tuple</code> and <code>System.ValueTuple</code> in C#?`,
  interviewA: `<code>Tuple</code> (pre-C# 7) is a class — heap-allocated, with unnamed properties (<code>.Item1</code>, <code>.Item2</code>). <code>ValueTuple</code> (C# 7+, the <code>(T1, T2)</code> syntax) is a struct — stack-allocated for small tuples, with named elements (<code>(string Name, int Age) t = ("Ada", 29); t.Name</code>). Prefer <code>ValueTuple</code> for all new code: it is more efficient, more readable, and supports deconstruction. Named elements are erased at runtime — they are compiler-only aliases for <code>.Item1</code>, <code>.Item2</code>, etc.`,
  related: ["records","pattern-matching","methods-parameters"],
  prerequisites: ["variables-types"]
};
