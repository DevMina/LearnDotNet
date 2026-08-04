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
  related: ["reflection"]
};
