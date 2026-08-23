export default {
  difficulty: 'advanced',
  versionLabel: 'C# 9 / .NET 5',
  tagline: "Emit C# source code at compile time — replace runtime reflection with generated code.",
  explanation: `
    <p>Source generators are compiler extensions (implementing <code>IIncrementalGenerator</code>) that run during the build. They receive the current compilation's syntax trees and symbols, and can add new source files to the compilation — files the compiler then compiles alongside your own code.</p>
    <p>The key benefit: generated code is compiled once, type-safe, and runs at full speed without any runtime reflection. <code>System.Text.Json</code>'s source generator produces a serialiser for your types at build time, making JSON ~2–4× faster than reflection-based serialisation. <code>Microsoft.Extensions.Logging</code>'s source generator produces strongly-typed log methods that avoid boxing arguments.</p>
  `,
  keyPoints: [
    'Generators run at compile time — output is ordinary C# that is compiled with your project',
    'IIncrementalGenerator is the modern API (prefer over the older ISourceGenerator)',
    'Generated files appear under Analyzers in Solution Explorer and can be debugged',
    'System.Text.Json, logging, DI registration, and Regex all ship built-in generators in .NET 7+',
    '[GeneratedRegex] compiles a regex pattern to a state machine at build time — no runtime parsing',
  ],
  code: `// Using a built-in generator: System.Text.Json source gen
using System.Text.Json.Serialization;

[JsonSerializable(typeof(WeatherForecast))]
internal partial class AppJsonContext : JsonSerializerContext { }

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary);

// Serialise without reflection
var forecast = new WeatherForecast(DateOnly.FromDateTime(DateTime.Now), 22, "Sunny");
string json = JsonSerializer.Serialize(forecast, AppJsonContext.Default.WeatherForecast);
Console.WriteLine(json);

// Built-in logging generator — no boxing, no allocation
public partial class WeatherService(ILogger<WeatherService> logger) {
    [LoggerMessage(Level = LogLevel.Information, Message = "Fetching forecast for {City}")]
    private partial void LogFetch(string city);

    public void Fetch(string city) {
        LogFetch(city);  // ← generated method, zero allocation
    }
}

// Built-in regex generator — compiled to a state machine at build time
[GeneratedRegex(@"^\\d{4}-\\d{2}-\\d{2}$")]
private static partial Regex DatePattern();
Console.WriteLine(DatePattern().IsMatch("2026-08-22")); // True`,
  output: `{"date":"2026-08-22","temperatureC":22,"summary":"Sunny"}
True`,
  prerequisites: ['reflection', 'attributes', 'generics'],
  mistakes: [
    'Using ISourceGenerator (v1) instead of IIncrementalGenerator — v1 is slow and deprecated',
    'Generating code that depends on user-provided runtime state — generators only have compile-time info',
    'Forgetting to mark the target class partial — generated partial classes require this',
    'Not caching SyntaxProvider results — generators re-run on every keystroke in the IDE',
  ],
  related: ['reflection', 'attributes', 'performance-tips'],
  interviewQ: 'What problem do source generators solve that reflection cannot?',
  interviewA: 'Reflection has three fundamental problems: it is slow (member lookup is not cached by default), it breaks with AOT/NativeAOT compilation (which strips metadata), and it provides no compile-time type safety. Source generators solve all three: the generated code runs at full compiled speed, is preserved under AOT (because it is ordinary C#), and is fully type-checked at build time. The tradeoff is that generators only have access to compile-time information — they cannot react to runtime values.',
  whyItMatters: 'Source generators are central to .NET\'s performance story for cloud and mobile. NativeAOT deployment — publishing a self-contained .exe with no JIT — requires source generators for serialisation, DI, and logging because runtime reflection is not available. Understanding them is increasingly important as AOT becomes the default for high-performance .NET services.',
};
