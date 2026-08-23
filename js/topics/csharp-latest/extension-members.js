export default {
  versionLabel: "C# 14",
  tagline: "Extension blocks add static and instance properties, not just methods.",
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
  prerequisites: ["extension-methods","interfaces"],
  mistakes: [
      "Defining extension members in the wrong namespace \u2014 callers must use the right namespace to see them",
      "Overloading an extension method with the same signature as an instance method \u2014 instance method always wins",
      "Making extension methods stateful \u2014 they're static and can't hold instance state"
  ],
  difficulty: 'advanced',
  whyItMatters: `Extension blocks generalise extension methods to the full member surface — properties, static members, and eventually more. They enable richer, more natural API layering on types you do not own, without subclassing.`,
  interviewQ: `What can extension members do that classic extension methods (C# 3) cannot?`,
  interviewA: `Classic extension methods can only add instance methods. Extension blocks (C# 14) can additionally add instance properties, static members, and operator overloads to existing types — all without modifying the original type or creating a subclass. For example, you can add a <code>IsValidEmail</code> property to <code>string</code> or a static <code>Parse</code> method to a third-party type. The runtime representation is still static methods; only the calling syntax and the supported member kinds change.`,
  related: ["extension-methods","interfaces","static-members"]
};
