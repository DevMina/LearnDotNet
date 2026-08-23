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
  ],

  difficulty: 'intermediate',

  interviewQ: `What is the Repository pattern and when should you skip it with EF Core?`,

  interviewA: `Repository abstracts data access behind an interface, keeping the domain layer ignorant of whether data comes from SQL Server, Cosmos DB, or a flat file. The argument for skipping it with EF Core: <code>DbContext</code> already is a unit-of-work and <code>DbSet&lt;T&gt;</code> already is a queryable repository — wrapping it again adds a layer without adding abstraction. The argument for keeping it: <code>IQueryable</code> leaking through the repository makes it hard to swap the data layer, and direct <code>DbContext</code> references scatter infrastructure concerns throughout the domain. A middle path: use EF Core directly in application services but hide <code>DbContext</code> behind an interface for testing.`,

  whyItMatters: `The Repository debate is one of the most common architecture discussions in .NET teams. Understanding both sides — why it was valuable pre-ORM and why some consider it redundant with EF Core — signals architectural maturity.`,

  prerequisites: ["interfaces","dependency-injection","solid-principles"],
  related: ["interfaces","dependency-injection","ef-core","solid-principles"]
};
