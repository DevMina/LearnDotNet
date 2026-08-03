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
True`
};
