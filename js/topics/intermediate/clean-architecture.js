export default {
  tagline: "Organise code in layers where dependencies only point inward.",
  explanation: `
          <p><strong>Clean Architecture</strong> (Robert C. Martin) organises a codebase into concentric layers — <em>Domain</em> at the centre (entities, value objects, domain logic), <em>Application</em> around it (use cases, interfaces), <em>Infrastructure</em> outside (database, email, HTTP clients), and <em>Presentation</em> at the edge (API controllers, Razor pages). The <strong>dependency rule</strong>: nothing in an inner layer ever references an outer one.</p>
          <p>This means your domain and application logic — the code that actually matters — has zero dependency on ASP.NET Core, Entity Framework, or any other framework. It can be tested with plain unit tests, and the infrastructure can be swapped without touching business logic. In .NET this is typically implemented with separate projects: <em>Domain</em>, <em>Application</em>, <em>Infrastructure</em>, and <em>API</em>.</p>
        `,
  keyPoints: [
    "Dependencies point inward — Domain knows nothing about Infrastructure or the API layer",
    "Application layer defines interfaces; Infrastructure implements them (Dependency Inversion)",
    "Outer layers reference inner layers, never the reverse — enforced by project references"
  ],
  code: `// Domain (innermost) — no framework references
public record Product(Guid Id, string Name, decimal Price);

// Application — depends only on Domain
public interface IProductRepository
{
    Task<Product?> GetById(Guid id);
}

public class GetProductQuery
{
    private readonly IProductRepository _repo;
    public GetProductQuery(IProductRepository repo) => _repo = repo;
    public Task<Product?> Execute(Guid id) => _repo.GetById(id);
}

// Infrastructure — implements Application's interfaces
// public class EfProductRepository : IProductRepository { ... }

// API — thin, delegates to Application
// app.MapGet("/products/{id}", (Guid id, GetProductQuery q) => q.Execute(id));`,
  output: `// Domain and Application compile and test independently of any framework.
// Swap EF for Dapper — only Infrastructure changes.`,
  related: ["solid-principles", "dependency-injection", "interfaces", "unit-testing"],
  mistakes: [
      "Letting Domain entities reference Infrastructure types \u2014 breaks the dependency rule and makes the domain untestable",
      "Putting business logic in controllers or Minimal API handlers \u2014 those are delivery mechanisms, not a place for rules",
      "Over-engineering a small app with full Clean Architecture layers \u2014 the pattern earns its complexity at scale"
  ],

  difficulty: 'advanced',

  interviewQ: `What is the dependency rule in Clean Architecture?`,

  interviewA: `The dependency rule states that source code dependencies must point only inward — toward higher-level policy, never toward lower-level detail. This means your domain layer (entities, business rules) has no reference to infrastructure (database, HTTP clients, file I/O). Infrastructure depends on domain, not the reverse. This is enforced by defining interfaces in the domain layer and implementing them in the infrastructure layer — the Dependency Inversion Principle in practice.`,

  whyItMatters: `Clean Architecture keeps the business rules — the most valuable part of the system — completely isolated from infrastructure concerns that change frequently (frameworks, databases, UIs). This makes the core logic testable without any infrastructure setup, and swappable when technology choices change.`,

  prerequisites: ["solid-principles","dependency-injection","interfaces"],
};
