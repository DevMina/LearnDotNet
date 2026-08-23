export default {
  difficulty: 'intermediate',
  tagline: "EF Core maps your C# classes to database tables and translates LINQ to SQL.",
  explanation: `
    <p>Entity Framework Core is .NET's official ORM. You define <strong>entities</strong> (plain C# classes), a <strong>DbContext</strong> (the database session), and EF Core handles generating SQL, tracking changes, and mapping results back to objects. Queries are written as LINQ against <code>DbSet&lt;T&gt;</code> properties and translated to the target database dialect (SQL Server, PostgreSQL, SQLite, etc.).</p>
    <p><strong>Migrations</strong> keep the database schema in sync with your model — <code>dotnet ef migrations add</code> generates a migration file from model changes, and <code>dotnet ef database update</code> applies it. No manual DDL scripts needed.</p>
  `,
  keyPoints: [
    'DbContext is the unit of work and change tracker — create one per request via DI (Scoped)',
    'DbSet<T> is the queryable repository for each entity type',
    'LINQ queries are translated to SQL and executed lazily when enumerated',
    'SaveChangesAsync() applies all tracked changes in a single transaction',
    'No-tracking queries (.AsNoTracking()) are faster for read-only scenarios',
  ],
  code: `// Entity
public class Product {
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}

// DbContext
public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options) {
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
}

// Program.cs registration
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Repository usage
public class ProductService(AppDbContext db) {

    // Read — translated to SELECT ... WHERE Price < 50 ORDER BY Name
    public Task<List<Product>> GetCheapAsync() =>
        db.Products
          .Where(p => p.Price < 50)
          .OrderBy(p => p.Name)
          .Include(p => p.Category)   // JOIN to load navigation property
          .AsNoTracking()             // Faster — not tracked for changes
          .ToListAsync();

    // Write
    public async Task<Product> CreateAsync(string name, decimal price) {
        var product = new Product { Name = name, Price = price };
        db.Products.Add(product);
        await db.SaveChangesAsync();  // INSERT + gets back generated Id
        return product;
    }
}`,
  output: `// SELECT p.Id, p.Name, p.Price, c.Id, c.Name
// FROM Products p
// JOIN Categories c ON p.CategoryId = c.Id
// WHERE p.Price < 50
// ORDER BY p.Name`,
  prerequisites: ['linq', 'dependency-injection', 'async-await', 'ienumerable-iqueryable'],
  mistakes: [
    'Using a Singleton DbContext — it holds a connection and is not thread-safe across requests',
    'Forgetting AsNoTracking() for read-only queries — tracked queries hold references that prevent GC',
    'Loading navigation properties without Include() — causes N+1 queries',
    'Calling SaveChangesAsync() multiple times in a loop — batch changes and call it once',
  ],
  related: ['linq', 'dependency-injection', 'ienumerable-iqueryable', 'repository'],
  interviewQ: 'What is the N+1 query problem and how does EF Core\'s Include() fix it?',
  interviewA: 'The N+1 problem occurs when you load N entities and then, for each one, run an additional query to load its related data — resulting in N+1 database roundtrips. Example: loading 100 orders and then fetching items for each in a loop = 101 queries. <code>.Include(o =&gt; o.Items)</code> tells EF Core to join the Items table in the same SQL query, returning all data in one roundtrip. For complex scenarios, <code>.AsSplitQuery()</code> splits into two efficient queries instead of a potentially large join.',
  whyItMatters: 'EF Core is the default data access layer in most .NET applications. Understanding DbContext lifetime, lazy vs eager loading, and IQueryable vs IEnumerable boundaries is the difference between an application that makes one efficient query per request and one that generates hundreds of tiny queries and runs out of database connections under load.',
};
