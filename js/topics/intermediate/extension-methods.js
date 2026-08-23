export default {
  tagline: "Add methods to a type you don’t own.",
  explanation: `
          <p><strong>Extension methods</strong> let you "add" a method to an existing type — even one from the .NET framework you can't modify — by defining a static method in a static class where the first parameter is prefixed with <em>this</em>.</p>
          <p>LINQ itself is implemented entirely as extension methods on <em>IEnumerable&lt;T&gt;</em>, which is why <em>.Where()</em> appears to be a method on every collection type.</p>
        `,
  keyPoints: [
  "Defined as static methods in a static class, first param uses this",
  "Called as if they were instance methods on the extended type",
  "LINQ’s entire operator set is implemented this way"
],
  code: `public static class StringExtensions
{
    public static string Truncate(this string s, int max) =>
        s.Length <= max ? s : s[..max] + "...";
}

string bio = "Loves distributed systems and long walks";
Console.WriteLine(bio.Truncate(20));`,
  output: `Loves distributed s...`,
  mistakes: [
      "Adding extension methods to very broad types (object, string) \u2014 they pollute every using context",
      "Hiding instance methods with extension methods of the same signature \u2014 instance method always wins, causing confusion",
      "Putting extension methods in the same namespace as the type they extend \u2014 makes them always visible"
  ],

  interviewQ: `What are extension methods and what are their limitations?`,

  interviewA: `Extension methods add methods to existing types without subclassing or modifying the original type. They are defined as static methods in a static class with <code>this T</code> as the first parameter, and are called as if they were instance methods. Limitations: they cannot access private members; instance methods always take precedence over extensions with the same signature; they can surprise readers who do not know the namespace is imported; and they cannot be used to add properties, operators (before C# 14), or events.`,

  whyItMatters: `Extension methods are the backbone of fluent APIs — LINQ itself is a set of extension methods on <code>IEnumerable&lt;T&gt;</code>. They let you enrich types you do not own (third-party libraries, BCL types) with domain-specific helpers without inheritance.`,

  prerequisites: ["classes-objects"],
  related: ["interfaces","linq","extension-members","static-members"],
  difficulty: 'intermediate'
};
