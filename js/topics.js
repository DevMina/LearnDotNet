// Content data for the site. Each category is a Solution Explorer "folder";
// each topic is a "file" within it.

const CATEGORIES = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    topics: [
      {
        id: 'variables-types',
        title: 'Variables & Types',
        tagline: 'C# is statically typed — every variable has a type known at compile time.',
        explanation: `
          <p>Every variable in C# is declared with a type, and the compiler checks that type at build time rather than at runtime. This catches a whole category of bugs before your program ever runs. You can either name the type explicitly (<strong>int</strong>, <strong>string</strong>, <strong>bool</strong>) or let the compiler infer it with <strong>var</strong> — the type is still fixed once assigned, <strong>var</strong> just saves you typing it out.</p>
          <p>C# distinguishes <strong>value types</strong> (like <em>int</em>, <em>double</em>, <em>struct</em>), which hold their data directly, from <strong>reference types</strong> (like <em>string</em>, <em>class</em>), which hold a pointer to data elsewhere. This distinction affects how copying and comparison behave.</p>
        `,
        keyPoints: [
          'var infers the type at compile time — it is not dynamic typing',
          'Value types are copied by value; reference types are copied by reference',
          'Nullable value types use a ? suffix, e.g. int?'
        ],
        code: `int age = 29;
double price = 19.99;
string name = "Ada";
var isActive = true;          // inferred as bool
int? score = null;            // nullable value type

Console.WriteLine($"{name} is {age}, active: {isActive}");
Console.WriteLine($"Score has value: {score.HasValue}");`,
        output: `Ada is 29, active: True
Score has value: False`
      },
      {
        id: 'operators',
        title: 'Operators & Expressions',
        tagline: 'Arithmetic, logical, and null-handling operators.',
        explanation: `
          <p>C# supports the usual arithmetic and comparison operators, plus a few that make null-handling much less verbose. The <strong>null-coalescing operator</strong> (<em>??</em>) supplies a fallback value when the left side is null, and <strong>??=</strong> assigns only if the variable is currently null.</p>
          <p>The <strong>null-conditional operator</strong> (<em>?.</em>) short-circuits to null instead of throwing when you access a member on a null reference — extremely common when working with data that may be missing.</p>
        `,
        keyPoints: [
          '?? returns a fallback when the left operand is null',
          '?. safely navigates a possibly-null reference',
          'Compound assignment operators (+=, -=) mutate in place'
        ],
        code: `string? city = null;
string display = city ?? "Unknown city";

Person? person = null;
int? nameLength = person?.Name?.Length;

Console.WriteLine(display);
Console.WriteLine(nameLength ?? -1);

record Person(string Name);`,
        output: `Unknown city
-1`
      },
      {
        id: 'control-flow',
        title: 'Control Flow',
        tagline: 'if/else, switch statements, and switch expressions.',
        explanation: `
          <p>Beyond the familiar <strong>if / else if / else</strong>, modern C# has a <strong>switch expression</strong> — a compact, value-producing alternative to the older switch statement. It uses pattern matching, so you can match on types, ranges, and shapes, not just constant values.</p>
          <p>Switch expressions must be exhaustive or include a discard pattern (<em>_</em>) as a catch-all, which the compiler will warn you about if missing.</p>
        `,
        keyPoints: [
          'Switch expressions return a value using =>',
          'The _ pattern acts as the default/catch-all case',
          'Pattern matching can test types and value ranges, not just equality'
        ],
        code: `int score = 82;

string grade = score switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    _     => "F"
};

Console.WriteLine($"Grade: {grade}");`,
        output: `Grade: B`
      },
      {
        id: 'loops',
        title: 'Loops',
        tagline: 'for, foreach, while, and do-while.',
        explanation: `
          <p><strong>foreach</strong> is the idiomatic way to iterate any <em>IEnumerable</em> — arrays, lists, dictionaries — without managing an index. Use a plain <strong>for</strong> loop when you need the index itself or want to iterate in a non-standard step.</p>
          <p><strong>while</strong> checks its condition before each iteration; <strong>do-while</strong> checks after, guaranteeing the body runs at least once.</p>
        `,
        keyPoints: [
          'foreach cannot modify the collection it is iterating over',
          'break exits a loop entirely; continue skips to the next iteration',
          'do-while always executes its body at least once'
        ],
        code: `var fruits = new[] { "apple", "kiwi", "mango" };

foreach (var fruit in fruits)
{
    if (fruit == "kiwi") continue;
    Console.WriteLine(fruit);
}

int i = 0;
do
{
    Console.WriteLine($"tick {i}");
    i++;
} while (i < 2);`,
        output: `apple
mango
tick 0
tick 1`
      },
      {
        id: 'arrays-collections',
        title: 'Arrays & Collections',
        tagline: 'Fixed-size arrays vs. resizable List<T> and Dictionary<K,V>.',
        explanation: `
          <p>Arrays have a fixed length set at creation. <strong>List&lt;T&gt;</strong> from <em>System.Collections.Generic</em> wraps an array internally but resizes automatically as you add items, making it the default choice for most collections.</p>
          <p><strong>Dictionary&lt;TKey, TValue&gt;</strong> stores key-value pairs with near-constant-time lookups, ideal whenever you need to look something up by a unique key rather than scan a list.</p>
        `,
        keyPoints: [
          'List<T> grows dynamically; arrays do not',
          'Dictionary<K,V> lookups are much faster than scanning a List for a match',
          'Both implement IEnumerable<T>, so foreach works on either'
        ],
        code: `var scores = new List<int> { 90, 85, 77 };
scores.Add(99);

var ages = new Dictionary<string, int>
{
    ["Ada"] = 29,
    ["Grace"] = 34
};

Console.WriteLine($"Scores: {string.Join(", ", scores)}");
Console.WriteLine($"Grace is {ages["Grace"]}");`,
        output: `Scores: 90, 85, 77, 99
Grace is 34`
      }
    ]
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    topics: [
      {
        id: 'classes-objects',
        title: 'Classes & Objects',
        tagline: 'The blueprint (class) and the instance (object).',
        explanation: `
          <p>A <strong>class</strong> defines the shape of something — its fields, properties, and methods. An <strong>object</strong> is a concrete instance created from that blueprint with <em>new</em>. Properties (using <em>get</em>/<em>set</em>) expose a class's state while letting you control how it's read or written.</p>
          <p>Constructors initialize a new object's state; C# also supports <strong>object initializer syntax</strong> to set public properties inline at creation time.</p>
        `,
        keyPoints: [
          'Properties can have different access levels for get vs set',
          'Object initializers set properties without a custom constructor',
          'this refers to the current instance inside a method'
        ],
        code: `public class Car
{
    public string Model { get; set; }
    public int Year { get; private set; }

    public Car(string model, int year)
    {
        Model = model;
        Year = year;
    }
}

var car = new Car("Civic", 2023);
Console.WriteLine($"{car.Model} ({car.Year})");`,
        output: `Civic (2023)`
      },
      {
        id: 'inheritance',
        title: 'Inheritance',
        tagline: 'Sharing behavior through a base class.',
        explanation: `
          <p>A class can inherit from a single base class using a colon, gaining its public and protected members. <strong>override</strong> lets a derived class replace a base method marked <strong>virtual</strong>, while <strong>base.Method()</strong> calls the original implementation from within the override.</p>
          <p>C# supports single inheritance only — a class can extend one base class, but implement multiple interfaces (see the Interfaces topic).</p>
        `,
        keyPoints: [
          'Only virtual/abstract members can be overridden',
          'base.Method() invokes the parent version explicitly',
          'C# has single class inheritance, but multiple interface implementation'
        ],
        code: `public class Animal
{
    public virtual string Speak() => "...";
}

public class Dog : Animal
{
    public override string Speak() => "Woof! " + base.Speak();
}

Animal a = new Dog();
Console.WriteLine(a.Speak());`,
        output: `Woof! ...`
      },
      {
        id: 'interfaces',
        title: 'Interfaces',
        tagline: 'A contract for what a type can do, not how.',
        explanation: `
          <p>An <strong>interface</strong> declares members without implementing them — it's a contract. Any class or struct that implements the interface must provide the implementation. A single class can implement any number of interfaces, which is how C# achieves multiple-inheritance-like flexibility.</p>
          <p>Interfaces are the backbone of dependency injection and testability: code that depends on <em>ILogger</em> rather than a concrete <em>FileLogger</em> can be swapped or mocked freely.</p>
        `,
        keyPoints: [
          'A class can implement multiple interfaces',
          'Interfaces enable loose coupling and easier unit testing',
          'Since C# 8, interfaces can include default method implementations'
        ],
        code: `public interface IShape
{
    double Area();
}

public class Circle : IShape
{
    public double Radius { get; init; }
    public double Area() => Math.PI * Radius * Radius;
}

IShape shape = new Circle { Radius = 2 };
Console.WriteLine($"Area: {shape.Area():F2}");`,
        output: `Area: 12.57`
      },
      {
        id: 'polymorphism',
        title: 'Polymorphism',
        tagline: 'One interface, many implementations.',
        explanation: `
          <p>Polymorphism means you can treat different concrete types uniformly through a shared base type or interface. A <em>List&lt;IShape&gt;</em> can hold circles, squares, and triangles, and calling <em>.Area()</em> on each dispatches to the correct implementation at runtime — this is <strong>runtime (dynamic) dispatch</strong>.</p>
          <p>This is what makes code extensible: you can add a new shape type without touching the code that iterates over shapes.</p>
        `,
        keyPoints: [
          'Runtime dispatch picks the correct override based on the actual object type',
          'Enables adding new types without modifying existing consuming code',
          'Works through both base classes and interfaces'
        ],
        code: `IShape[] shapes = { new Circle { Radius = 1 }, new Circle { Radius = 3 } };

foreach (var s in shapes)
    Console.WriteLine($"{s.GetType().Name}: {s.Area():F2}");`,
        output: `Circle: 3.14
Circle: 28.27`
      },
      {
        id: 'encapsulation',
        title: 'Encapsulation',
        tagline: 'Controlling access with public, private, and protected.',
        explanation: `
          <p>Encapsulation means hiding internal state and exposing only what's needed. C# controls this with access modifiers: <strong>private</strong> (this class only), <strong>protected</strong> (this class and subclasses), <strong>internal</strong> (this assembly), and <strong>public</strong> (anyone).</p>
          <p>A common pattern is a private backing field with a public property that validates input before allowing a change, keeping the object always in a valid state.</p>
        `,
        keyPoints: [
          'private fields with public properties let you validate before mutating state',
          'protected exposes members to subclasses but not the outside world',
          'Encapsulation reduces the surface area that other code can break'
        ],
        code: `public class BankAccount
{
    private decimal _balance;

    public decimal Balance => _balance;

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Must be positive");
        _balance += amount;
    }
}

var acct = new BankAccount();
acct.Deposit(150);
Console.WriteLine($"Balance: {acct.Balance:C}");`,
        output: `Balance: $150.00`
      },
      {
        id: 'abstract-classes',
        title: 'Abstract Classes',
        tagline: 'Partial blueprints that can\u2019t be instantiated directly.',
        explanation: `
          <p>An <strong>abstract class</strong> can mix implemented members with <em>abstract</em> members that have no body — subclasses are required to implement them. Unlike an interface, an abstract class can hold shared state and constructor logic, making it a good fit when related types share real behavior, not just a contract.</p>
          <p>You cannot create an instance of an abstract class directly with <em>new</em>; it only exists to be extended.</p>
        `,
        keyPoints: [
          'Abstract classes can have both implemented and abstract members',
          'Cannot be instantiated directly — only through a derived class',
          'Choose abstract class over interface when subclasses share real state or logic'
        ],
        code: `public abstract class Employee
{
    public string Name { get; init; }
    public abstract decimal CalculatePay();

    public void PrintPaycheck() =>
        Console.WriteLine($"{Name}: {CalculatePay():C}");
}

public class SalariedEmployee : Employee
{
    public decimal AnnualSalary { get; init; }
    public override decimal CalculatePay() => AnnualSalary / 12;
}

Employee e = new SalariedEmployee { Name = "Sam", AnnualSalary = 84000 };
e.PrintPaycheck();`,
        output: `Sam: $7,000.00`
      }
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    topics: [
      {
        id: 'generics',
        title: 'Generics',
        tagline: 'Write one algorithm that works across many types, safely.',
        explanation: `
          <p><strong>Generics</strong> let you parameterize a class or method by type, so <em>List&lt;T&gt;</em> works identically whether T is <em>int</em>, <em>string</em>, or a custom class — without boxing value types or casting objects, and with full compile-time type checking.</p>
          <p>Constraints (<em>where T : IComparable&lt;T&gt;</em>) restrict what T can be, letting you call members on T that the compiler otherwise couldn't guarantee exist.</p>
        `,
        keyPoints: [
          'Generics give type safety without duplicating code per type',
          'Constraints (where T : ...) unlock operations on the generic type',
          'Avoids boxing/unboxing overhead that untyped collections had'
        ],
        code: `T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) > 0 ? a : b;

Console.WriteLine(Max(3, 7));
Console.WriteLine(Max("pear", "kiwi"));`,
        output: `7
pear`
      },
      {
        id: 'delegates-events',
        title: 'Delegates & Events',
        tagline: 'Type-safe references to methods, and the pub/sub pattern built on them.',
        explanation: `
          <p>A <strong>delegate</strong> is a type-safe function pointer — a variable that holds a reference to a method matching a given signature. <strong>Action</strong> and <strong>Func</strong> are built-in generic delegate types for the common cases of "no return value" and "returns a value."</p>
          <p>An <strong>event</strong> wraps a delegate to implement publish/subscribe: a class exposes an event, other code subscribes with <em>+=</em>, and the class invokes it when something happens — without the subscribers needing a reference to each other.</p>
        `,
        keyPoints: [
          'Action<T> and Func<T,TResult> cover most delegate use cases without a custom delegate type',
          'Events restrict outside code to only += and -=, not direct invocation',
          'Multiple methods can subscribe to the same event (multicast)'
        ],
        code: `public class Button
{
    public event Action? Clicked;
    public void Click() => Clicked?.Invoke();
}

var button = new Button();
button.Clicked += () => Console.WriteLine("Handler A fired");
button.Clicked += () => Console.WriteLine("Handler B fired");
button.Click();`,
        output: `Handler A fired
Handler B fired`
      },
      {
        id: 'linq',
        title: 'LINQ',
        tagline: 'Query collections declaratively, like SQL for in-memory data.',
        explanation: `
          <p><strong>LINQ</strong> (Language Integrated Query) adds query operators like <em>Where</em>, <em>Select</em>, <em>OrderBy</em>, and <em>GroupBy</em> directly onto any <em>IEnumerable&lt;T&gt;</em>. These are lazily evaluated — nothing runs until you actually enumerate the result, e.g. with <em>foreach</em> or <em>.ToList()</em>.</p>
          <p>LINQ works identically over in-memory collections, XML, and (via EF Core) SQL databases, which is why it's worth learning early — the same mental model applies everywhere.</p>
        `,
        keyPoints: [
          'LINQ queries are lazily evaluated until enumerated',
          'Method syntax (.Where().Select()) and query syntax (from...where...select) are equivalent',
          'Works over in-memory collections, XML, and EF Core database queries'
        ],
        code: `var numbers = new[] { 4, 8, 15, 16, 23, 42 };

var result = numbers
    .Where(n => n > 10)
    .Select(n => n * 2)
    .OrderBy(n => n);

Console.WriteLine(string.Join(", ", result));`,
        output: `30, 32, 46, 84`
      },
      {
        id: 'exceptions',
        title: 'Exception Handling',
        tagline: 'try/catch/finally and when to throw.',
        explanation: `
          <p>C# uses exceptions for error conditions that are exceptional, not for routine control flow. A <strong>try</strong> block runs code that might fail; matching <strong>catch</strong> blocks handle specific exception types; <strong>finally</strong> always runs, making it the right place for cleanup like closing a file.</p>
          <p>Catch specific exception types before general ones — catching the base <em>Exception</em> type first would swallow everything, hiding bugs you actually want to see.</p>
        `,
        keyPoints: [
          'Catch specific exception types before general ones',
          'finally always runs, whether or not an exception occurred',
          'Prefer exceptions for truly exceptional cases, not expected branching'
        ],
        code: `try
{
    int[] nums = { 1, 2, 3 };
    Console.WriteLine(nums[5]);
}
catch (IndexOutOfRangeException ex)
{
    Console.WriteLine($"Caught: {ex.Message}");
}
finally
{
    Console.WriteLine("Cleanup ran");
}`,
        output: `Caught: Index was outside the bounds of the array.
Cleanup ran`
      },
      {
        id: 'extension-methods',
        title: 'Extension Methods',
        tagline: 'Add methods to a type you don\u2019t own.',
        explanation: `
          <p><strong>Extension methods</strong> let you "add" a method to an existing type — even one from the .NET framework you can't modify — by defining a static method in a static class where the first parameter is prefixed with <em>this</em>.</p>
          <p>LINQ itself is implemented entirely as extension methods on <em>IEnumerable&lt;T&gt;</em>, which is why <em>.Where()</em> appears to be a method on every collection type.</p>
        `,
        keyPoints: [
          'Defined as static methods in a static class, first param uses this',
          'Called as if they were instance methods on the extended type',
          'LINQ\u2019s entire operator set is implemented this way'
        ],
        code: `public static class StringExtensions
{
    public static string Truncate(this string s, int max) =>
        s.Length <= max ? s : s[..max] + "...";
}

string bio = "Loves distributed systems and long walks";
Console.WriteLine(bio.Truncate(20));`,
        output: `Loves distributed s...`
      }
    ]
  },
  {
    id: 'async',
    name: 'Async & Concurrency',
    topics: [
      {
        id: 'async-await',
        title: 'async / await',
        tagline: 'Non-blocking code that reads like synchronous code.',
        explanation: `
          <p>Marking a method <strong>async</strong> lets you use <strong>await</strong> inside it to pause execution until a <em>Task</em> completes — without blocking the calling thread. This is essential for I/O-bound work like network calls or file access, where blocking a thread while waiting would waste resources.</p>
          <p>An async method typically returns <em>Task</em> or <em>Task&lt;T&gt;</em> rather than <em>void</em>, so callers can await it and observe exceptions properly.</p>
        `,
        keyPoints: [
          'await frees the thread while waiting, it does not block it',
          'Async methods should return Task or Task<T>, avoid async void',
          'Exceptions inside an async method surface when the Task is awaited'
        ],
        code: `async Task<string> FetchGreetingAsync()
{
    await Task.Delay(100); // simulates network latency
    return "Hello from the server";
}

var result = await FetchGreetingAsync();
Console.WriteLine(result);`,
        output: `Hello from the server`
      },
      {
        id: 'tpl',
        title: 'Task Parallel Library',
        tagline: 'Running independent work concurrently.',
        explanation: `
          <p><strong>Task.WhenAll</strong> runs multiple independent async operations concurrently and completes once they all finish — much faster than awaiting them one at a time when they don't depend on each other.</p>
          <p>Use <strong>Task.Run</strong> to offload CPU-bound work onto a background thread pool thread; use plain <em>async/await</em> (no Task.Run) for I/O-bound work, since it doesn't need a dedicated thread while waiting.</p>
        `,
        keyPoints: [
          'Task.WhenAll runs independent tasks concurrently, not sequentially',
          'Task.Run is for CPU-bound work; plain async/await suits I/O-bound work',
          'Awaiting tasks one-by-one in a loop loses the concurrency benefit'
        ],
        code: `async Task<int> SquareAfterDelay(int n)
{
    await Task.Delay(50);
    return n * n;
}

var tasks = new[] { SquareAfterDelay(2), SquareAfterDelay(3), SquareAfterDelay(4) };
var results = await Task.WhenAll(tasks);

Console.WriteLine(string.Join(", ", results));`,
        output: `4, 9, 16`
      },
      {
        id: 'threading-basics',
        title: 'Threading Basics',
        tagline: 'Shared state needs coordination.',
        explanation: `
          <p>When multiple threads write to shared state, you need synchronization to avoid race conditions — two threads reading-then-writing the same variable can lose an update. The <strong>lock</strong> keyword ensures only one thread executes a block at a time.</p>
          <p>For simple counters, <strong>Interlocked</strong> operations are faster than a full lock, performing the increment atomically at the hardware level.</p>
        `,
        keyPoints: [
          'lock prevents two threads from entering the same block simultaneously',
          'Interlocked.Increment is a lightweight atomic alternative for simple counters',
          'Unsynchronized shared state is a common source of subtle, hard-to-reproduce bugs'
        ],
        code: `int counter = 0;
object gate = new();

void Increment()
{
    lock (gate)
    {
        counter++;
    }
}

Parallel.For(0, 1000, _ => Increment());
Console.WriteLine($"Final count: {counter}");`,
        output: `Final count: 1000`
      }
    ]
  },
  {
    id: 'modern-dotnet',
    name: 'Modern .NET',
    topics: [
      {
        id: 'records',
        title: 'Records',
        tagline: 'Immutable, value-based data types with almost no boilerplate.',
        explanation: `
          <p>A <strong>record</strong> is designed for modeling immutable data. It gets value-based equality (two records are equal if their properties match, unlike classes which compare references), a generated <em>ToString()</em>, and a compact constructor syntax for free.</p>
          <p><strong>with</strong> expressions create a modified copy without mutating the original — useful for immutable update patterns common in functional-style code.</p>
        `,
        keyPoints: [
          'Records compare by value, classes compare by reference by default',
          'with expressions produce a copy with specific properties changed',
          'Best suited to data that represents a snapshot rather than a mutable entity'
        ],
        code: `public record Point(int X, int Y);

var p1 = new Point(1, 2);
var p2 = p1 with { Y = 9 };

Console.WriteLine(p1);
Console.WriteLine(p2);
Console.WriteLine(p1 == new Point(1, 2));`,
        output: `Point { X = 1, Y = 2 }
Point { X = 1, Y = 9 }
True`
      },
      {
        id: 'pattern-matching',
        title: 'Pattern Matching',
        tagline: 'Testing shape and structure, not just equality.',
        explanation: `
          <p>Pattern matching goes beyond checking if a value equals something — it can test a value's <strong>type</strong>, its <strong>properties</strong>, and its <strong>shape</strong> all in one expression. Combined with switch expressions, this replaces a lot of nested if/else type-checking code.</p>
          <p><strong>Property patterns</strong> (matching on an object's field values) and <strong>relational patterns</strong> (&lt;, &gt;=, etc.) can be combined for expressive, readable conditions.</p>
        `,
        keyPoints: [
          'Type patterns test and cast in a single step: obj is string s',
          'Property patterns match on an object\u2019s field values directly',
          'Combines cleanly with switch expressions for multi-branch logic'
        ],
        code: `record Shape(string Kind, double Radius);

string Describe(Shape s) => s switch
{
    { Kind: "circle", Radius: > 5 } => "Large circle",
    { Kind: "circle" }              => "Circle",
    { Kind: "square" }               => "Square",
    _                                => "Unknown shape"
};

Console.WriteLine(Describe(new Shape("circle", 4)));
Console.WriteLine(Describe(new Shape("circle", 9)));`,
        output: `Circle
Large circle`
      },
      {
        id: 'nullable-reference-types',
        title: 'Nullable Reference Types',
        tagline: 'Letting the compiler catch null-reference bugs before runtime.',
        explanation: `
          <p>With nullable reference types enabled (the default in new projects), <em>string</em> means "never null" while <em>string?</em> explicitly allows null. The compiler then warns you at build time if you dereference something that could be null without checking first.</p>
          <p>This doesn't add a runtime check — it's a compile-time analysis that turns a common source of <em>NullReferenceException</em> crashes into a build warning you see immediately.</p>
        `,
        keyPoints: [
          'string means non-null, string? means nullable, once the feature is enabled',
          'Purely a compile-time warning system, not a runtime guard',
          'Enabled by default in new project templates since .NET 6'
        ],
        code: `#nullable enable

string GetGreeting(string? name)
{
    if (name is null) return "Hello, stranger";
    return $"Hello, {name}";
}

Console.WriteLine(GetGreeting(null));
Console.WriteLine(GetGreeting("Priya"));`,
        output: `Hello, stranger
Hello, Priya`
      }
    ]
  },
  {
    id: 'patterns',
    name: 'Design Patterns',
    topics: [
      {
        id: 'singleton',
        title: 'Singleton',
        tagline: 'Guarantee exactly one instance exists.',
        explanation: `
          <p>The <strong>Singleton</strong> pattern ensures a class has only one instance and gives global access to it — commonly used for things like configuration or logging where multiple instances would be wasteful or inconsistent.</p>
          <p>In modern C#, this is usually implemented with a static readonly field, or delegated entirely to a dependency injection container registering the service as "singleton" lifetime.</p>
        `,
        keyPoints: [
          'A private constructor prevents outside code from creating more instances',
          'Static readonly fields are initialized once, thread-safely, by the runtime',
          'In ASP.NET Core apps, DI containers manage singleton lifetime for you'
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
      },
      {
        id: 'factory',
        title: 'Factory',
        tagline: 'Centralize object creation logic.',
        explanation: `
          <p>The <strong>Factory</strong> pattern moves the decision of *which concrete type to create* into one place, so calling code depends only on an interface or base type, not a specific implementation. This makes it easy to add new types later without touching the calling code.</p>
          <p>It's especially useful when construction involves branching logic (based on config, input, or environment) that would otherwise be duplicated everywhere an object is created.</p>
        `,
        keyPoints: [
          'Calling code depends on the abstraction, not the concrete class',
          'Centralizes branching creation logic in a single method',
          'Adding a new variant means changing the factory only, not every call site'
        ],
        code: `public interface INotifier { void Send(string msg); }
public class EmailNotifier : INotifier
{ public void Send(string msg) => Console.WriteLine($"Email: {msg}"); }
public class SmsNotifier : INotifier
{ public void Send(string msg) => Console.WriteLine($"SMS: {msg}"); }

static class NotifierFactory
{
    public static INotifier Create(string channel) => channel switch
    {
        "email" => new EmailNotifier(),
        "sms"   => new SmsNotifier(),
        _ => throw new ArgumentException("Unknown channel")
    };
}

NotifierFactory.Create("sms").Send("Order shipped");`,
        output: `SMS: Order shipped`
      },
      {
        id: 'observer',
        title: 'Observer',
        tagline: 'One-to-many notification without tight coupling.',
        explanation: `
          <p>The <strong>Observer</strong> pattern lets one object (the subject) notify many dependent objects (observers) when its state changes, without the subject knowing anything concrete about them. C#'s built-in <strong>event</strong> keyword is a direct, language-level implementation of this pattern.</p>
          <p>This decouples the source of a change from whatever needs to react to it — the publisher never needs a reference to the subscriber's type.</p>
        `,
        keyPoints: [
          'The subject holds no reference to concrete observer types, only the event',
          'C# events are effectively Observer built into the language',
          'Any number of observers can subscribe or unsubscribe at runtime'
        ],
        code: `public class StockTicker
{
    public event Action<decimal>? PriceChanged;
    public void UpdatePrice(decimal price) => PriceChanged?.Invoke(price);
}

var ticker = new StockTicker();
ticker.PriceChanged += p => Console.WriteLine($"Dashboard sees: {p:C}");
ticker.PriceChanged += p => Console.WriteLine($"Alert service sees: {p:C}");

ticker.UpdatePrice(142.50m);`,
        output: `Dashboard sees: $142.50
Alert service sees: $142.50`
      },
      {
        id: 'strategy',
        title: 'Strategy',
        tagline: 'Swap an algorithm at runtime behind a shared interface.',
        explanation: `
          <p>The <strong>Strategy</strong> pattern defines a family of interchangeable algorithms behind a common interface, letting you select or swap the algorithm at runtime rather than hardcoding one path with conditionals.</p>
          <p>In C#, this often collapses into simply passing a <em>Func&lt;T,TResult&gt;</em> delegate instead of defining a full interface with multiple implementing classes — a lightweight version of the same idea.</p>
        `,
        keyPoints: [
          'Encapsulates interchangeable algorithms behind one interface',
          'Lets you choose the algorithm at runtime, e.g. from configuration',
          'Can be implemented with a full interface, or simply a Func<T,TResult> delegate'
        ],
        code: `public interface IDiscountStrategy { decimal Apply(decimal total); }
public class NoDiscount : IDiscountStrategy
{ public decimal Apply(decimal total) => total; }
public class TenPercentOff : IDiscountStrategy
{ public decimal Apply(decimal total) => total * 0.9m; }

decimal Checkout(decimal total, IDiscountStrategy strategy)
    => strategy.Apply(total);

Console.WriteLine(Checkout(200m, new TenPercentOff()));`,
        output: `180.0`
      },
      {
        id: 'repository',
        title: 'Repository',
        tagline: 'Abstract data access behind a collection-like interface.',
        explanation: `
          <p>The <strong>Repository</strong> pattern puts a collection-like interface (<em>GetById</em>, <em>Add</em>, <em>GetAll</em>) in front of your actual data source — a database, an API, or an in-memory store — so the rest of your application doesn't know or care which one it's talking to.</p>
          <p>This is what makes unit testing business logic possible without a real database: you inject an in-memory fake repository during tests, and the real EF Core-backed one in production.</p>
        `,
        keyPoints: [
          'Business logic depends on IRepository<T>, never a concrete database class',
          'Swap in a fake/in-memory implementation for fast unit tests',
          'Commonly paired with dependency injection to supply the right implementation'
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
        output: `Task A, Task B`
      }
    ]
  }
];

// Flat lookup: topicId -> { topic, category, index in category }
const TOPIC_INDEX = {};
CATEGORIES.forEach(cat => {
  cat.topics.forEach((t, idx) => {
    TOPIC_INDEX[t.id] = { topic: t, category: cat, index: idx };
  });
});
