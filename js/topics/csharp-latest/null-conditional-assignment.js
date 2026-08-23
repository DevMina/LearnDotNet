export default {
  versionLabel: "C# 14",
  tagline: "Use ?. on the left side of an assignment.",
  explanation: `
          <p>Before C# 14, safely assigning to a property on a possibly-null object required an explicit <em>if</em> check first. <strong>Null-conditional assignment</strong> lets you write <em>customer?.Name = "Guest"</em> directly — the right-hand side is only evaluated and assigned when the receiver isn't null, and the whole statement is a no-op otherwise.</p>
          <p>It also works with compound assignment operators like <em>+=</em> and <em>-=</em>, though not with <em>++</em> or <em>--</em>.</p>
        `,
  keyPoints: [
  "Works with compound assignment too, e.g. += and -=",
  "Not supported for ++ or --",
  "The right-hand expression isn’t evaluated at all when the receiver is null"
],
  code: `public class Customer { public string Name { get; set; } = "Guest"; }

Customer? customer = null;
customer?.Name = "Priya"; // no-op, customer is null

customer = new Customer();
customer?.Name = "Priya"; // assigns

Console.WriteLine(customer.Name);`,
  output: `Priya`,
  prerequisites: ["nullable-value-types","nullable-value-types"],
  mistakes: [
      "Using ??= when you actually want to overwrite existing values \u2014 ??= only assigns if the left side is null",
      "Forgetting that ??= is not atomic \u2014 it's not thread-safe without additional synchronisation",
      "Chaining ??= with side-effectful right-hand sides without realising the right side runs at most once"
  ],
  difficulty: 'beginner',
  whyItMatters: `Null-conditional assignment (C# 14) makes null-guarded property writes a single expression. Combined with null-coalescing assignment (<code>??=</code>), it covers virtually every common null-default-assignment pattern concisely and without if-block noise.`,
  interviewQ: `What is the difference between <code>??=</code> and <code>?.Property = value</code>?`,
  interviewA: `<code>??=</code> assigns to the left-hand side only when the left-hand side itself is null — it is a null-coalescing assignment to a variable: <code>name ??= "default"</code>. <code>?.Property = value</code> (C# 14) assigns to a property only when the object on the left of <code>?.</code> is not null — it is a conditional write to a nested property: <code>config?.Timeout = 30</code>. They solve opposite problems: one guards against a null target, the other guards against a null container.`,
  related: ["nullable-value-types","nullable-reference-types"]
};
