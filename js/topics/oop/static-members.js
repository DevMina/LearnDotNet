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
  output: `2`,
  mistakes: [
      "Storing mutable state in static fields \u2014 it's shared across all threads and requests, causing race conditions",
      "Static classes with many unrelated methods \u2014 they become grab-bags that are hard to test or extend",
      "Calling static methods directly in business logic instead of injecting an abstraction \u2014 breaks testability"
  ],

  whyItMatters: `Static members provide class-level state and behaviour that does not depend on a specific instance — counters, factories, extension method hosts, and utility classes all use statics. Understanding the threading implications of static state is critical for web applications where many requests share the same process.`,
  difficulty: 'beginner',
  interviewQ: `What are the threading risks of static fields in a web application?`,
  interviewA: `Static fields are shared across all threads in the process. In a web application, multiple requests run concurrently — if two requests read and write the same static field without synchronisation, you have a race condition. Solutions: make the field read-only after initialisation (<code>static readonly</code>), use <code>Interlocked</code> operations for atomic counters, use <code>lock</code> for complex mutations, or redesign to use scoped DI services instead of statics. Thread-static fields (<code>[ThreadStatic]</code>) give each thread its own copy, which is sometimes the correct approach for ambient context.`,
  related: ["classes-objects","dependency-injection","singleton"],
  prerequisites: ["classes-objects"]
};
