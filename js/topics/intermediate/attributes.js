export default {
  tagline: "Attach declarative metadata that tools or the runtime can read.",
  explanation: `
          <p><strong>Attributes</strong> attach metadata to a type, method, or property without changing its behavior directly — <em>[Obsolete]</em>, <em>[Serializable]</em>, and validation attributes like <em>[Required]</em> are all built-in examples. The compiler understands some attributes directly; others are read by libraries or your own code via reflection.</p>
          <p>A custom attribute is simply a class that derives from <strong>System.Attribute</strong>.</p>
        `,
  keyPoints: [
  "Attributes describe code; they don’t run unless something reads them via reflection",
  "Built-in attributes like [Obsolete] are understood directly by the compiler",
  "A custom attribute is just a class deriving from System.Attribute"
],
  code: `public class ObsoleteExample
{
    [Obsolete("Use NewMethod instead")]
    public void OldMethod() => Console.WriteLine("old behavior");
}

var attr = typeof(ObsoleteExample)
    .GetMethod("OldMethod")!
    .GetCustomAttributes(typeof(ObsoleteAttribute), false)
    .FirstOrDefault() as ObsoleteAttribute;

Console.WriteLine(attr?.Message);`,
  output: `Use NewMethod instead`,
  related: ["reflection"],
  mistakes: [
      "Applying attributes without understanding their actual effect \u2014 many require framework support to do anything",
      "Forgetting AttributeUsage \u2014 without it, the attribute can be applied anywhere, even where it makes no sense",
      "Accessing attribute data with reflection in hot paths \u2014 reflection is slow, cache the result"
  ],

  difficulty: 'intermediate',

  whyItMatters: `Attributes are how the .NET ecosystem communicates metadata from your code to frameworks at runtime — validation rules, serialisation settings, route definitions, test markers. Writing your own attributes is the correct way to add declarative framework-style behaviour to your own libraries.`,

  prerequisites: ["classes-objects","reflection"],
  interviewQ: `How do you create a custom attribute and read it at runtime?`,
  interviewA: `Derive a class from <code>Attribute</code>, add <code>[AttributeUsage(...)]</code> to control where it can be applied, and add properties or constructor parameters for its data. Read it at runtime with reflection: <code>typeof(MyClass).GetCustomAttribute&lt;MyAttr&gt;()</code> or on a member: <code>method.GetCustomAttribute&lt;MyAttr&gt;()</code>. Convention: attribute class names end in "Attribute" but callers can omit the suffix. For performance in .NET 7+, use source generators or cached reflection instead of calling <code>GetCustomAttribute</code> on every request.`
};
