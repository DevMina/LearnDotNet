export default {
  tagline: "Swap an algorithm at runtime behind a shared interface.",
  explanation: `
          <p>The <strong>Strategy</strong> pattern defines a family of interchangeable algorithms behind a common interface, letting you select or swap the algorithm at runtime rather than hardcoding one path with conditionals.</p>
          <p>In C#, this often collapses into simply passing a <em>Func&lt;T,TResult&gt;</em> delegate instead of defining a full interface with multiple implementing classes — a lightweight version of the same idea.</p>
        `,
  keyPoints: [
  "Encapsulates interchangeable algorithms behind one interface",
  "Lets you choose the algorithm at runtime, e.g. from configuration",
  "Can be implemented with a full interface, or simply a Func<T,TResult> delegate"
],
  code: `public interface IDiscountStrategy { decimal Apply(decimal total); }
public class NoDiscount : IDiscountStrategy
{ public decimal Apply(decimal total) => total; }
public class TenPercentOff : IDiscountStrategy
{ public decimal Apply(decimal total) => total * 0.9m; }

decimal Checkout(decimal total, IDiscountStrategy strategy)
    => strategy.Apply(total);

Console.WriteLine(Checkout(200m, new TenPercentOff()));`,
  output: `180.0`,
  related: ["command"]
};
