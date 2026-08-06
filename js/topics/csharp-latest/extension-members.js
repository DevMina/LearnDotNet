export default {
  tagline: "Extension blocks add static and instance properties, not just methods (C# 14).",
  explanation: `
          <p>Traditional extension methods could only add instance methods to an existing type. C# 14 introduces a new <strong>extension block</strong> syntax that also supports extension <strong>properties</strong> and <strong>static</strong> extension members, letting you extend a type more fully without modifying its original definition.</p>
          <p>Existing <em>this</em>-parameter extension methods you've already written keep working exactly as before — this is purely additive.</p>
        `,
  keyPoints: [
  "Extension blocks group multiple extension members together for a type",
  "Supports instance and static properties, in addition to methods",
  "Existing this-parameter extension methods still work exactly as before"
],
  code: `public static class ListExtensions
{
    extension<T>(List<T> list)
    {
        public bool IsEmpty => list.Count == 0;
    }
}

var names = new List<string>();
Console.WriteLine(names.IsEmpty);
names.Add("Ada");
Console.WriteLine(names.IsEmpty);`,
  output: `True
False`,
  mistakes: [
      "Defining extension members in the wrong namespace \u2014 callers must use the right namespace to see them",
      "Overloading an extension method with the same signature as an instance method \u2014 instance method always wins",
      "Making extension methods stateful \u2014 they're static and can't hold instance state"
  ]
};
