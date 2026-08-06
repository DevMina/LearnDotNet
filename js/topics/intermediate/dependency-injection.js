export default {
  tagline: "Ask for what you need instead of constructing it yourself.",
  explanation: `
          <p><strong>Dependency injection (DI)</strong> is a technique where a class declares the services it depends on (usually via constructor parameters) instead of creating them internally with <em>new</em>. Something external — a <strong>DI container</strong> — is responsible for supplying the right implementation.</p>
          <p>This decouples code from concrete implementations, making it easy to swap a real service for a test double, and is built directly into ASP.NET Core via <em>IServiceCollection</em>, with common lifetimes of <strong>Singleton</strong>, <strong>Scoped</strong>, and <strong>Transient</strong>.</p>
        `,
  keyPoints: [
  "Classes depend on abstractions (interfaces), not concrete implementations",
  "A container resolves and supplies dependencies, usually via the constructor",
  "ASP.NET Core has DI built in: AddSingleton, AddScoped, AddTransient"
],
  code: `public interface IGreeter
{
    string Greet(string name);
}

public class FriendlyGreeter : IGreeter
{
    public string Greet(string name) => $"Hey there, {name}!";
}

public class Program
{
    private readonly IGreeter _greeter;
    public Program(IGreeter greeter) => _greeter = greeter;
    public void Run() => Console.WriteLine(_greeter.Greet("Mina"));
}

var app = new Program(new FriendlyGreeter());
app.Run();`,
  output: `Hey there, Mina!`,
  related: ["interfaces", "reflection", "unit-testing", "solid-principles"],
  mistakes: [
      "Injecting a Scoped service into a Singleton \u2014 the scoped service is captured and outlives its scope",
      "Resolving services from IServiceProvider directly (service locator) instead of injecting them \u2014 hides dependencies",
      "Registering the same service twice with different lifetimes \u2014 the last registration wins, which is rarely intended"
  ]
};
