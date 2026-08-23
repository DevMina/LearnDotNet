export default {
  tagline: "Guarantee exactly one instance exists.",
  explanation: `
          <p>The <strong>Singleton</strong> pattern ensures a class has only one instance and gives global access to it — commonly used for things like configuration or logging where multiple instances would be wasteful or inconsistent.</p>
          <p>In modern C#, this is usually implemented with a static readonly field, or delegated entirely to a dependency injection container registering the service as "singleton" lifetime.</p>
        `,
  keyPoints: [
  "A private constructor prevents outside code from creating more instances",
  "Static readonly fields are initialized once, thread-safely, by the runtime",
  "In ASP.NET Core apps, DI containers manage singleton lifetime for you"
],
  code: `public class Logger
{
    private static readonly Logger _instance = new();
    public static Logger Instance => _instance;

    private Logger() { }
    public void Log(string msg) => Console.WriteLine($"[LOG] {msg}");
}

Logger.Instance.Log("Application started");
Console.WriteLine(ReferenceEquals(Logger.Instance, Logger.Instance));`,
  output: `[LOG] Application started
True`,
  mistakes: [
      "Implementing Singleton without thread safety \u2014 two threads can create two instances simultaneously",
      "Singleton holding mutable state in an ASP.NET app \u2014 it's shared across all requests and users",
      "Using Singleton when a simple static class would do \u2014 they solve the same problem but Singleton is testable"
  ],

  difficulty: 'intermediate',

  interviewQ: `Why is Singleton considered an anti-pattern in modern C# development?`,

  interviewA: `Singletons introduce global mutable state, which makes code hard to test (you cannot swap the singleton for a fake), hard to parallelise (shared state needs locking), and hard to understand (any part of the code can mutate it). In ASP.NET Core, the DI container manages singleton lifetime for you — registering a service as <code>AddSingleton&lt;T&gt;</code> gives you one instance per application lifetime without any of the implementation downsides. The manual Singleton pattern (private constructor, static field) is mostly obsolete in DI-aware code.`,

  whyItMatters: `Understanding why Singleton is considered harmful — and the DI-based alternative — is a signal of maturity in software design. It comes up frequently in interviews and code reviews as a test of whether a developer understands testability and dependency management.`,

  prerequisites: ["classes-objects","dependency-injection"],
  related: ["classes-objects","dependency-injection","static-members"]
};
