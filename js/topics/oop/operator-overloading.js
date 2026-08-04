export default {
  tagline: "Define what +, ==, and other operators mean for your own type.",
  explanation: `
          <p>C# lets you overload operators like <strong>+</strong>, <strong>-</strong>, <strong>==</strong>, and <strong>!=</strong> for your own types using the <em>operator</em> keyword, so instances can be combined with the same syntax as built-in numeric types. This is especially natural for value-like types such as a <em>Money</em> or <em>Vector</em> struct, where "adding two of them together" has an obvious meaning.</p>
          <p>Use it sparingly — only when the operator's meaning is genuinely unambiguous for the type; overloading <em>+</em> to do something unrelated to addition just confuses readers.</p>
        `,
  keyPoints: [
  "Defined as public static methods using the operator keyword",
  "If you overload == you should also overload != and override Equals/GetHashCode",
  "Use sparingly — only when the operator’s meaning is genuinely obvious for the type"
],
  code: `public struct Money
{
    public decimal Amount { get; }
    public Money(decimal amount) => Amount = amount;

    public static Money operator +(Money a, Money b) => new(a.Amount + b.Amount);
    public override string ToString() => Amount.ToString("C");
}

var total = new Money(10.50m) + new Money(4.25m);
Console.WriteLine(total);`,
  output: `$14.75`,
  related: ["method-overloading"]
};
