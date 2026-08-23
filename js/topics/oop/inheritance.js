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
  prerequisites: ["classes-objects"],
  mistakes: [
      "Overusing inheritance for code reuse \u2014 prefer composition when the 'is-a' relationship isn't real",
      "Forgetting to call base() in a constructor, leaving the base class uninitialised",
      "Sealing a class too early, or never sealing it \u2014 be intentional about whether subclassing is intended"
  ],
  interviewQ: `What is the difference between method overriding and method hiding in C#?`,
  interviewA: `Overriding uses the <code>virtual</code>/<code>override</code> pair — the correct method is chosen at runtime based on the actual object type (polymorphism). Hiding uses <code>new</code> — the method chosen depends on the declared type of the variable at compile time. Hiding is almost always the wrong choice; it breaks polymorphism and surprises callers.`,
  whyItMatters: `Inheritance lets you model "is-a" relationships and share behaviour across a hierarchy. Understanding it is the foundation for design patterns, polymorphism, and the Liskov Substitution Principle.`,
  related: ["classes-objects","interfaces","abstract-classes","polymorphism","sealed"],
  difficulty: 'beginner'
};
