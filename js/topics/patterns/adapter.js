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
  related: ["decorator"]
};
