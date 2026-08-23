export default {
  tagline: "One interface, many implementations.",
  explanation: `
          <p>Polymorphism means you can treat different concrete types uniformly through a shared base type or interface. A <em>List&lt;IShape&gt;</em> can hold circles, squares, and triangles, and calling <em>.Area()</em> on each dispatches to the correct implementation at runtime — this is <strong>runtime (dynamic) dispatch</strong>.</p>
          <p>This is what makes code extensible: you can add a new shape type without touching the code that iterates over shapes.</p>
        `,
  keyPoints: [
  "Runtime dispatch picks the correct override based on the actual object type",
  "Enables adding new types without modifying existing consuming code",
  "Works through both base classes and interfaces"
],
  code: `IShape[] shapes = { new Circle { Radius = 1 }, new Circle { Radius = 3 } };

foreach (var s in shapes)
    Console.WriteLine($"{s.GetType().Name}: {s.Area():F2}");`,
  output: `Circle: 3.14
Circle: 28.27`,
  mistakes: [
      "Forgetting virtual on the base method \u2014 without it, the derived method hides rather than overrides",
      "Using new instead of override \u2014 the method is hidden, not overridden, and virtual dispatch won't reach it",
      "Testing with is/typeof instead of using virtual dispatch \u2014 that's what polymorphism is for"
  ],

  interviewQ: `What is the difference between compile-time and runtime polymorphism in C#?`,

  interviewA: `Compile-time (static) polymorphism is resolved at build time — method overloading and generics fall here. The compiler picks which method to call based on the static types. Runtime (dynamic) polymorphism is resolved when the program runs — virtual method dispatch, interface dispatch, and the <code>dynamic</code> keyword. Virtual dispatch is the foundation of object-oriented design: you write code against an abstraction (base type or interface) and the actual implementation is chosen at runtime based on the concrete type.`,

  whyItMatters: `Polymorphism is what makes the Open/Closed Principle possible — you can extend a system with new types without modifying existing consuming code. It is the mechanism behind plugin architectures, extensible frameworks, and every design pattern that involves strategy or template method.`,

  prerequisites: ["inheritance","interfaces"],
  difficulty: 'intermediate',
  related: ["inheritance","interfaces","abstract-classes","pattern-matching"]
};
