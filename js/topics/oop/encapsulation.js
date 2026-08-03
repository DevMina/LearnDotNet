export default {
  tagline: "Controlling access with public, private, and protected.",
  explanation: `
          <p>Encapsulation means hiding internal state and exposing only what's needed. C# controls this with access modifiers: <strong>private</strong> (this class only), <strong>protected</strong> (this class and subclasses), <strong>internal</strong> (this assembly), and <strong>public</strong> (anyone).</p>
          <p>A common pattern is a private backing field with a public property that validates input before allowing a change, keeping the object always in a valid state.</p>
        `,
  keyPoints: [
  "private fields with public properties let you validate before mutating state",
  "protected exposes members to subclasses but not the outside world",
  "Encapsulation reduces the surface area that other code can break"
],
  code: `public class BankAccount
{
    private decimal _balance;

    public decimal Balance => _balance;

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Must be positive");
        _balance += amount;
    }
}

var acct = new BankAccount();
acct.Deposit(150);
Console.WriteLine($"Balance: {acct.Balance:C}");`,
  output: `Balance: $150.00`
};
