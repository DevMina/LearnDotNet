export default {
  tagline: "Prevent further inheritance or overriding.",
  explanation: `
          <p>Marking a class <strong>sealed</strong> prevents any other class from inheriting from it — useful once a type's design shouldn't be extended further, and it lets the JIT apply certain optimizations since it knows no override can exist elsewhere.</p>
          <p>You can also apply <strong>sealed override</strong> to an individual member in a derived class, locking that one member's implementation in place while still allowing further subclasses of the derived class itself.</p>
        `,
  keyPoints: [
  "A sealed class cannot be a base class for any other class",
  "sealed override locks in one member’s implementation while leaving the class itself inheritable",
  "Common for small, complete value-like types — many built-in .NET types are sealed"
],
  code: `public class Base
{
    public virtual string Describe() => "Base";
}

public sealed class Final : Base
{
    public override string Describe() => "Final";
}

// class Nope : Final { }  // compile error: cannot inherit from sealed class

Base b = new Final();
Console.WriteLine(b.Describe());`,
  output: `Final`,
  mistakes: [
      "Sealing every class by default before the design is stable \u2014 it prevents extension without modification",
      "Forgetting that sealed on a method only makes sense if the method was virtual in a base class",
      "Not sealing performance-critical classes when you intended to \u2014 the JIT can devirtualise calls on sealed types"
  ],

  difficulty: 'intermediate',

  interviewQ: `What is the purpose of the <code>sealed</code> keyword and when should you use it?`,

  interviewA: `<code>sealed</code> prevents a class from being inherited. On a class, it stops subclassing entirely. On an override, it stops further overriding in deeper subclasses. Use it when you have deliberately designed a class not to be extended — it communicates intent and allows the JIT to devirtualise calls (a real performance benefit in tight loops). The .NET runtime seals many core types (e.g. <code>string</code>) for exactly this reason.`,

  whyItMatters: `Sealing classes is a defensive design choice. If you publish a library, unsealed classes become an implicit API contract — callers can subclass them and depend on internal behaviour. Sealing gives you the freedom to change internals without breaking subclasses.`,
  related: ["inheritance","classes-objects","performance-tips"],
  prerequisites: ["inheritance"]
};
