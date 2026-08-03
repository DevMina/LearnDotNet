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
Circle: 28.27`
};
