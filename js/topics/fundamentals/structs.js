export default {
  tagline: "Value types for small, self-contained data.",
  explanation: `
          <p>A <strong>struct</strong> is a value type — assigning or passing one copies its data rather than sharing a reference. That makes structs a good fit for small, short-lived values like a point or a money amount, where copy semantics are exactly what you want and avoiding a heap allocation matters.</p>
          <p>Unlike classes, structs can't inherit from another class or struct (though they can implement interfaces), and every field must be assigned before the constructor finishes.</p>
        `,
  keyPoints: [
  "Structs are copied by value; classes are copied by reference",
  "Best for small, short-lived data where copy overhead is cheap",
  "Structs can implement interfaces but cannot inherit from a class or another struct"
],
  code: `public struct Point
{
    public int X { get; set; }
    public int Y { get; set; }
}

Point a = new Point { X = 1, Y = 2 };
Point b = a;      // copies the value
b.X = 99;

Console.WriteLine($"a.X = {a.X}, b.X = {b.X}");`,
  output: `a.X = 1, b.X = 99`,
  related: ["boxing-unboxing"]
};
