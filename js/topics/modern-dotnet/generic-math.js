export default {
  versionLabel: "C# 11 / .NET 7",
  tagline: "Write one algorithm that works across every numeric type (C# 11).",
  explanation: `
          <p><strong>Static abstract interface members</strong> let an interface declare a static member — including an operator — that every implementing type must provide. .NET's built-in numeric types (<em>int</em>, <em>double</em>, <em>decimal</em>...) all implement <strong>INumber&lt;T&gt;</strong>, so a single generic method constrained to <em>INumber&lt;T&gt;</em> works identically whether it's summing ints, doubles, or decimals.</p>
          <p>This removes the old need to duplicate numeric algorithms per type, or fall back to a slower, non-generic shared base type like <em>double</em>.</p>
        `,
  keyPoints: [
  "Static abstract members on an interface can be operators, not just regular methods",
  "All built-in numeric types implement INumber<T> and related interfaces",
  "Removes the old need to duplicate numeric algorithms per type"
],
  code: `T SumAll<T>(IEnumerable<T> values) where T : INumber<T>
{
    T total = T.Zero;
    foreach (var v in values) total += v;
    return total;
}

Console.WriteLine(SumAll(new[] { 1, 2, 3 }));
Console.WriteLine(SumAll(new[] { 1.5, 2.5 }));`,
  output: `6
4`,
  prerequisites: ["interfaces","generics"],
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ],
  difficulty: 'advanced',
  whyItMatters: `Generic math interfaces let you write a single numeric algorithm — sum, average, clamp, lerp — that works across int, double, decimal, and custom numeric types. Previously this required duplicating the method for each type or using dynamic dispatch.`,
  interviewQ: `What interface would you constrain a type parameter to if you want to add two values of that type generically?`,
  interviewA: `<code>IAdditionOperators&lt;TSelf, TOther, TResult&gt;</code> from <code>System.Numerics</code>, introduced in .NET 7. For the most common case where you want any numeric type, constrain with <code>where T : INumber&lt;T&gt;</code> — this gives you addition, subtraction, multiplication, comparison, and parsing in one interface. Example: <code>T Sum&lt;T&gt;(IEnumerable&lt;T&gt; items) where T : INumber&lt;T&gt; =&gt; items.Aggregate(T.Zero, (a, b) =&gt; a + b);</code>`,
  related: ["generics","interfaces","span"]
};
