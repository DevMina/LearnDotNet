export default {
  tagline: "Sharing behavior through a base class.",
  explanation: `
          <p>A class can inherit from a single base class using a colon, gaining its public and protected members. <strong>override</strong> lets a derived class replace a base method marked <strong>virtual</strong>, while <strong>base.Method()</strong> calls the original implementation from within the override.</p>
          <p>C# supports single inheritance only — a class can extend one base class, but implement multiple interfaces (see the Interfaces topic).</p>
        `,
  keyPoints: [
  "Only virtual/abstract members can be overridden",
  "base.Method() invokes the parent version explicitly",
  "C# has single class inheritance, but multiple interface implementation"
],
  code: `public class Animal
{
    public virtual string Speak() => "...";
}

public class Dog : Animal
{
    public override string Speak() => "Woof! " + base.Speak();
}

Animal a = new Dog();
Console.WriteLine(a.Speak());`,
  output: `Woof! ...`,
  mistakes: [
      "Overusing inheritance for code reuse \u2014 prefer composition when the 'is-a' relationship isn't real",
      "Forgetting to call base() in a constructor, leaving the base class uninitialised",
      "Sealing a class too early, or never sealing it \u2014 be intentional about whether subclassing is intended"
  ]
};
