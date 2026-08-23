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
True`,
  mistakes: [
      "Forgetting to override GetHashCode when overriding Equals \u2014 objects used as dictionary keys will break",
      "Comparing reference types with == when you mean value equality \u2014 override == or use Equals explicitly",
      "Making Equals throw on null argument \u2014 it should return false, not throw"
  ],

  difficulty: 'intermediate',

  interviewQ: `What is the difference between == and <code>Equals()</code> in C#?`,

  interviewA: `For reference types, <code>==</code> checks reference equality by default (same object on the heap) unless overloaded. <code>Equals()</code> also checks reference equality by default but is meant to be overridden for value-based equality. <code>string</code> overrides both to compare characters. For value types, both check structural equality. Records (C# 9) auto-generate value-based <code>==</code> and <code>Equals()</code>. Always implement <code>GetHashCode()</code> when you override <code>Equals()</code> — breaking the contract causes incorrect behaviour in dictionaries and hash sets.`,

  whyItMatters: `Equality bugs are among the hardest to diagnose because everything appears to work until an object lands in a dictionary or LINQ <code>Distinct()</code>. Understanding the equality contract — and when to use records instead of manually implementing it — prevents an entire category of subtle bugs.`,

  prerequisites: ["classes-objects"],
  related: ["classes-objects","records","generics","interfaces"]
};
