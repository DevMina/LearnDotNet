export default {
  tagline: "Abstract data access behind a collection-like interface.",
  explanation: `
          <p>The <strong>Repository</strong> pattern puts a collection-like interface (<em>GetById</em>, <em>Add</em>, <em>GetAll</em>) in front of your actual data source — a database, an API, or an in-memory store — so the rest of your application doesn't know or care which one it's talking to.</p>
          <p>This is what makes unit testing business logic possible without a real database: you inject an in-memory fake repository during tests, and the real EF Core-backed one in production.</p>
        `,
  keyPoints: [
  "Business logic depends on IRepository<T>, never a concrete database class",
  "Swap in a fake/in-memory implementation for fast unit tests",
  "Commonly paired with dependency injection to supply the right implementation"
],
  code: `public interface IRepository<T> { void Add(T item); IEnumerable<T> GetAll(); }

public class InMemoryRepository<T> : IRepository<T>
{
    private readonly List<T> _items = new();
    public void Add(T item) => _items.Add(item);
    public IEnumerable<T> GetAll() => _items;
}

IRepository<string> repo = new InMemoryRepository<string>();
repo.Add("Task A");
repo.Add("Task B");

Console.WriteLine(string.Join(", ", repo.GetAll()));`,
  output: `Task A, Task B`,
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ]
};
