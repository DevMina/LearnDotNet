export default {
  tagline: "== vs. Equals(), and why overriding one usually means overriding both.",
  explanation: `
          <p>For reference types, <strong>==</strong> compares references by default — are these the exact same object in memory? <strong>Equals</strong> can be overridden to compare by value instead. Records get this value-based behavior automatically; plain classes don't unless you write it yourself.</p>
          <p>If you override <em>Equals</em>, you must also override <strong>GetHashCode</strong> — two objects considered equal must always produce the same hash code, or collections like <em>Dictionary</em> and <em>HashSet</em> will behave incorrectly.</p>
        `,
  keyPoints: [
  "Records get value-based Equals/GetHashCode/== automatically; plain classes don’t",
  "If you override Equals, you must also override GetHashCode",
  "Two objects that are Equal must always return the same GetHashCode"
],
  code: `public class Point
{
    public int X, Y;
    public override bool Equals(object? obj) =>
        obj is Point p && X == p.X && Y == p.Y;
    public override int GetHashCode() => HashCode.Combine(X, Y);
}

var a = new Point { X = 1, Y = 2 };
var b = new Point { X = 1, Y = 2 };

Console.WriteLine(a == b);        // reference comparison, not overloaded here
Console.WriteLine(a.Equals(b));   // value comparison, overridden`,
  output: `False
True`
};
