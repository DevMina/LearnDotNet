export default {
  tagline: "Belongs to the type itself, not to any instance.",
  explanation: `
          <p>A <strong>static</strong> member belongs to the type, not to any particular object — there's exactly one copy, shared across every use of that type in the program. A <strong>static class</strong> (like <em>Math</em> or <em>Console</em>) can't be instantiated at all; it exists purely to group related static functionality.</p>
          <p>Instance members can freely access static members, but static members can't access instance members without being handed a specific instance to work with.</p>
        `,
  keyPoints: [
  "Static fields/state are shared across every part of the program that touches the type",
  "Static classes cannot be instantiated and cannot have instance members",
  "Instance members can access static members, but not vice versa without an instance"
],
  code: `public static class Counter
{
    public static int Total { get; private set; }
    public static void Increment() => Total++;
}

Counter.Increment();
Counter.Increment();
Console.WriteLine(Counter.Total);`,
  output: `2`
};
