export default {
  tagline: "Make an incompatible interface fit the one you need.",
  explanation: `
          <p>The <strong>Adapter</strong> pattern wraps an existing class behind a new interface so it can be used where that interface is expected, without modifying the original class. It's the classic fix for plugging a third-party or legacy API into code written against your own abstraction.</p>
          <p>Unlike Decorator, which adds behavior while keeping the same interface, Adapter's job is purely translation — converting one shape of API into another.</p>
        `,
  keyPoints: [
  "Adapter translates one interface into another without changing the original",
  "Common when integrating a third-party or legacy class into your own abstraction",
  "Differs from Decorator, which adds behavior rather than changing the interface"
],
  code: `public interface IJsonLogger
{
    void LogJson(string json);
}

public class LegacyFileLogger
{
    public void WriteLine(string text) => Console.WriteLine($"[FILE] {text}");
}

public class LegacyLoggerAdapter : IJsonLogger
{
    private readonly LegacyFileLogger _legacy;
    public LegacyLoggerAdapter(LegacyFileLogger legacy) => _legacy = legacy;
    public void LogJson(string json) => _legacy.WriteLine(json);
}

IJsonLogger logger = new LegacyLoggerAdapter(new LegacyFileLogger());
logger.LogJson("{\\"event\\":\\"started\\"}");`,
  output: `[FILE] {"event":"started"}`,
  related: ["decorator"],
  mistakes: [
      "Creating an adapter when you could change the original class \u2014 adapters add indirection; prefer direct changes when possible",
      "Making the adapter do more than translate the interface \u2014 additional logic belongs in a separate class",
      "Adapter over an adapter \u2014 indicates a design smell upstream"
  ],

  difficulty: 'intermediate',

  interviewQ: `When would you use the Adapter pattern in a real .NET project?`,

  interviewA: `Classic real-world uses: wrapping a third-party payment SDK behind your own <code>IPaymentGateway</code> interface so you can swap providers without touching business logic; adapting a legacy <code>DataSet</code>-based repository to a new <code>IRepository&lt;T&gt;</code> interface while migrating to EF Core; or creating a test double that adapts an in-memory list to an <code>IEmailSender</code> interface. The Adapter's job is to translate one interface into another — it is the seam that lets incompatible types work together.`,

  whyItMatters: `Adapters are the most common pattern for integrating third-party libraries without coupling your codebase to them. Every time you wrap an external SDK in an interface, you are applying the Adapter pattern — and making your code testable and future-proof in the process.`,

  prerequisites: ["interfaces","classes-objects"],
};
