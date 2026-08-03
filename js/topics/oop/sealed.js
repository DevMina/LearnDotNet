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
  output: `Final`
};
