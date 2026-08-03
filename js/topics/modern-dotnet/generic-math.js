export default {
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
4`
};
