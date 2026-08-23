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
  output: `Balance: $150.00`,
  mistakes: [
      "Exposing mutable collections as public properties \u2014 callers can modify the internal state directly",
      "Making fields public instead of using properties \u2014 bypasses validation and future-proofing",
      "Using public setters when init-only or constructor injection would enforce invariants"
  ],

  whyItMatters: `Encapsulation limits the surface area of change — when implementation details are private, you can refactor them freely without breaking callers. It is the primary reason object-oriented code can scale: you reason about one object at a time, trusting its public contract.`,
  difficulty: 'beginner',
  interviewQ: `What is the difference between <code>private</code>, <code>protected</code>, <code>internal</code>, and <code>protected internal</code> in C#?`,
  interviewA: `<code>private</code>: accessible only within the declaring type. <code>protected</code>: accessible within the type and any derived type, regardless of assembly. <code>internal</code>: accessible anywhere within the same assembly. <code>protected internal</code>: accessible from the same assembly OR from a derived type (union of both). <code>private protected</code> (C# 7.2): accessible within the same assembly AND only from derived types (intersection). The default for class members is <code>private</code>; for top-level types, <code>internal</code>.`,
  related: ["classes-objects","static-members","interfaces"],
  prerequisites: ["classes-objects"]
};
