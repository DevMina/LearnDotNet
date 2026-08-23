export default {
  difficulty: 'advanced',
  versionLabel: 'C# 3.0',
  tagline: "Represent a lambda as a data structure you can inspect, rewrite, or compile at runtime.",
  explanation: `
    <p>When you assign a lambda to a <code>Func&lt;T,bool&gt;</code>, the compiler generates IL that runs the function. When you assign the same lambda to <code>Expression&lt;Func&lt;T,bool&gt;&gt;</code>, the compiler instead generates an <strong>expression tree</strong> — a data structure describing the lambda's AST: nodes for parameters, binary operations, member accesses, method calls.</p>
    <p>This tree can be inspected (visitor pattern), rewritten (e.g. swap a parameter), compiled to a delegate with <code>.Compile()</code>, or handed to a query provider that translates it to SQL, OData, or another language. EF Core's LINQ-to-SQL works entirely through expression trees.</p>
  `,
  keyPoints: [
    'Expression<Func<T,bool>> holds a parse tree; Func<T,bool> holds compiled IL',
    'Call .Compile() to turn an expression tree into a runnable delegate',
    'ExpressionVisitor lets you walk and rewrite the tree',
    'EF Core, AutoMapper, FastMember, and most ORMs use expression trees to translate LINQ to queries',
    'Only a subset of C# is expressible as an expression tree — local functions, statements, and out params are not allowed',
  ],
  code: `using System.Linq.Expressions;

// Compiler builds an expression tree, not IL
Expression<Func<int, bool>> expr = x => x > 5;

// Inspect the tree
var binary = (BinaryExpression)expr.Body;
Console.WriteLine(binary.NodeType);  // GreaterThan
Console.WriteLine(binary.Right);     // 5

// Compile and run
Func<int, bool> fn = expr.Compile();
Console.WriteLine(fn(10)); // True
Console.WriteLine(fn(3));  // False

// Build a tree programmatically
ParameterExpression param = Expression.Parameter(typeof(int), "x");
Expression body = Expression.GreaterThan(param, Expression.Constant(5));
var built = Expression.Lambda<Func<int, bool>>(body, param);
Console.WriteLine(built.Compile()(8)); // True

// EF Core uses this under the hood
// dbContext.Users.Where(u => u.Age > 18)
// ↑ Expression<Func<User,bool>> → translated to SQL WHERE Age > 18`,
  output: `GreaterThan
5
True
False
True`,
  prerequisites: ['delegates-events', 'linq', 'generics'],
  mistakes: [
    'Assigning a complex lambda with statements to Expression<> — only expression-bodied lambdas work',
    'Calling .Compile() on every invocation — cache the compiled delegate',
    'Trying to use local variables that the provider cannot translate to SQL',
    'Confusing ExpressionVisitor (modifies tree) with ExpressionPrinter (inspects tree) use cases',
  ],
  related: ['delegates-events', 'linq', 'reflection'],
  interviewQ: 'How do expression trees enable EF Core to convert LINQ to SQL?',
  interviewA: 'When you write <code>dbSet.Where(u => u.Age &gt; 18)</code>, the parameter type is <code>Expression&lt;Func&lt;User,bool&gt;&gt;</code> — so the compiler emits an expression tree instead of compiled IL. EF Core\'s query provider walks that tree using the visitor pattern, recognising nodes like <code>MemberAccess(u, Age)</code> and <code>GreaterThan(..., 18)</code>, and emits the corresponding SQL fragment <code>WHERE Age &gt; 18</code>. The same lambda assigned to <code>Func&lt;User,bool&gt;</code> would compile to IL — opaque to EF Core and impossible to translate.',
  whyItMatters: 'Expression trees are what makes LINQ-to-SQL possible and power the entire ORM ecosystem. Understanding them demystifies why some LINQ queries translate to SQL and others throw "cannot be translated" errors — and equips you to build your own query translators or specification patterns.',
};
