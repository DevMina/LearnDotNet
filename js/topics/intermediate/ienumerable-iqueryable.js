export default {
  difficulty: 'intermediate',
  tagline: "IEnumerable filters data in memory; IQueryable translates LINQ to the data source.",
  explanation: `
    <p><code>IEnumerable&lt;T&gt;</code> is a pull-based sequence processed in memory. When you apply <code>.Where()</code> or <code>.Select()</code> on it, the data is already in the process — LINQ-to-Objects filters it with C# lambdas. All records must be fetched before any filtering happens.</p>
    <p><code>IQueryable&lt;T&gt;</code> extends <code>IEnumerable&lt;T&gt;</code> with an <code>Expression</code> tree and a query provider. LINQ operators on an <code>IQueryable</code> <em>build a query description</em> rather than executing immediately. When you enumerate (via <code>foreach</code>, <code>ToList()</code>, etc.), the provider translates the expression tree to a native query — SQL for EF Core, OData for Azure, and so on — and executes it at the source.</p>
  `,
  keyPoints: [
    'IEnumerable: processes data in C# memory after fetching it all',
    'IQueryable: builds an expression tree, translates to native query (e.g. SQL), filters at the source',
    'Calling AsEnumerable() on a DbSet switches to in-memory processing from that point',
    'IQueryable cannot use arbitrary C# methods — only those the provider knows how to translate',
    'Always call ToList()/ToArray() to materialise and close the database connection when you are done querying',
  ],
  code: `// IEnumerable — filters ALL records in memory (bad for large tables)
IEnumerable<Product> all = dbContext.Products.ToList(); // ← fetches everything
var cheap = all.Where(p => p.Price < 10);  // filtered in C#

// IQueryable — translates Where to SQL WHERE clause (efficient)
IQueryable<Product> query = dbContext.Products;          // no DB hit yet
query = query.Where(p => p.Price < 10);                  // adds SQL WHERE
query = query.OrderBy(p => p.Name);                      // adds ORDER BY
var results = await query.ToListAsync();                  // ONE SQL query

// AsEnumerable — switches to in-memory from here on
var mixed = dbContext.Products
    .Where(p => p.Price < 100)       // SQL WHERE (at the source)
    .AsEnumerable()
    .Where(p => MyCustomMethod(p));  // C# filter (in memory)

// N+1 problem — avoid this
foreach (var order in dbContext.Orders) {         // 1 query
    var items = dbContext.Items                    // N queries!
        .Where(i => i.OrderId == order.Id).ToList();
}
// Fix: use .Include(o => o.Items) instead`,
  output: `// Output depends on database content.
// The key point: IQueryable sends one SQL query with WHERE/ORDER BY.
// IEnumerable fetches all rows, then filters in C#.`,
  prerequisites: ['linq', 'generics', 'delegates-events'],
  mistakes: [
    'Calling ToList() on a DbSet before filtering — fetches the whole table',
    'Using a C# method inside IQueryable.Where() that EF Core cannot translate — runtime exception',
    'Leaving IQueryable unenumerated across multiple async operations — can hold DB connections open',
    'Forgetting that IQueryable implements IEnumerable — both support foreach, so the difference is silent',
  ],
  related: ['linq', 'generics', 'async-await'],
  interviewQ: 'What happens if you call <code>ToList()</code> before <code>Where()</code> on an EF Core query?',
  interviewA: 'Calling <code>ToList()</code> materialises the query — EF Core fetches all matching rows from the database into memory at that point. The subsequent <code>Where()</code> then runs as LINQ-to-Objects in C#, filtering the already-fetched data. This is a classic performance mistake: instead of generating <code>SELECT ... WHERE ...</code>, it generates <code>SELECT *</code> and discards most of the data in application memory. Always build the full query before calling <code>ToList()</code>.',
  whyItMatters: 'Misunderstanding this boundary is one of the most common causes of slow EF Core applications — and the N+1 query problem flows directly from it. Keeping your filters on IQueryable means EF Core generates efficient SQL; accidentally switching to IEnumerable means you pay for every row in the table.',
};
