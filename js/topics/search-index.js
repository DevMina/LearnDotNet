// Auto-generated: lightweight search metadata (tagline + key points + explanation text)
// for every topic, kept separate from the full topic content so search doesn't force
// eager-loading every topic's code/output on first paint.
export const SEARCH_INDEX = [
  {
    "id": "variables-types",
    "tagline": "C# is statically typed \u2014 every variable has a type known at compile time.",
    "keywords": "c# is statically typed \u2014 every variable has a type known at compile time. var infers the type at compile time \u2014 it is not dynamic typing value types are copied by value; reference types are copied by reference nullable value types use a ? suffix, e.g. int? every variable in c# is declared with a type, and the compiler checks that type at build time rather than at runtime. this catches a whole category of bugs before your program ever runs. you can either name the type explicitly ( int , string , bool ) or let the compiler infer it with var \u2014 the type is still fixed once assigned, var just saves you typing it out. c# distinguishes value types (like int , double , struct ), which hold their data directly, from reference types (like string , class ), which hold a pointer to data elsewhere. this distinction affects how copying and comparison behave."
  },
  {
    "id": "operators",
    "tagline": "Arithmetic, logical, and null-handling operators.",
    "keywords": "arithmetic, logical, and null-handling operators. ?? returns a fallback when the left operand is null ?. safely navigates a possibly-null reference compound assignment operators (+=, -=) mutate in place c# supports the usual arithmetic and comparison operators, plus a few that make null-handling much less verbose. the null-coalescing operator ( ?? ) supplies a fallback value when the left side is null, and ??= assigns only if the variable is currently null. the null-conditional operator ( ?. ) short-circuits to null instead of throwing when you access a member on a null reference \u2014 extremely common when working with data that may be missing."
  },
  {
    "id": "control-flow",
    "tagline": "if/else, switch statements, and switch expressions.",
    "keywords": "if/else, switch statements, and switch expressions. switch expressions return a value using => the _ pattern acts as the default/catch-all case pattern matching can test types and value ranges, not just equality beyond the familiar if / else if / else , modern c# has a switch expression \u2014 a compact, value-producing alternative to the older switch statement. it uses pattern matching, so you can match on types, ranges, and shapes, not just constant values. switch expressions must be exhaustive or include a discard pattern ( _ ) as a catch-all, which the compiler will warn you about if missing."
  },
  {
    "id": "loops",
    "tagline": "for, foreach, while, and do-while.",
    "keywords": "for, foreach, while, and do-while. foreach cannot modify the collection it is iterating over break exits a loop entirely; continue skips to the next iteration do-while always executes its body at least once foreach is the idiomatic way to iterate any ienumerable \u2014 arrays, lists, dictionaries \u2014 without managing an index. use a plain for loop when you need the index itself or want to iterate in a non-standard step. while checks its condition before each iteration; do-while checks after, guaranteeing the body runs at least once."
  },
  {
    "id": "arrays-collections",
    "tagline": "Fixed-size arrays vs. resizable List<T> and Dictionary<K,V>.",
    "keywords": "fixed-size arrays vs. resizable list<t> and dictionary<k,v>. list<t> grows dynamically; arrays do not dictionary<k,v> lookups are much faster than scanning a list for a match both implement ienumerable<t>, so foreach works on either arrays have a fixed length set at creation. list&lt;t&gt; from system.collections.generic wraps an array internally but resizes automatically as you add items, making it the default choice for most collections. dictionary&lt;tkey, tvalue&gt; stores key-value pairs with near-constant-time lookups, ideal whenever you need to look something up by a unique key rather than scan a list."
  },
  {
    "id": "structs",
    "tagline": "Value types for small, self-contained data.",
    "keywords": "value types for small, self-contained data. structs are copied by value; classes are copied by reference best for small, short-lived data where copy overhead is cheap structs can implement interfaces but cannot inherit from a class or another struct a struct is a value type \u2014 assigning or passing one copies its data rather than sharing a reference. that makes structs a good fit for small, short-lived values like a point or a money amount, where copy semantics are exactly what you want and avoiding a heap allocation matters. unlike classes, structs can't inherit from another class or struct (though they can implement interfaces), and every field must be assigned before the constructor finishes."
  },
  {
    "id": "enums",
    "tagline": "A closed, named set of constant values.",
    "keywords": "a closed, named set of constant values. backed by an integer type by default (int); can be changed, e.g. : byte [flags] lets enum values be combined with bitwise or enum.parse / tryparse convert strings to enum values at runtime an enum defines a type with a fixed set of named values, making code that would otherwise rely on magic numbers or raw strings self-documenting and type-checked by the compiler. under the hood, an enum is backed by an integer type ( int by default). combine values as bit flags with the [flags] attribute when a variable needs to represent more than one option at once, and use enum.parse to convert a string into an enum value at runtime."
  },
  {
    "id": "tuples-deconstruction",
    "tagline": "Group a few values together without declaring a class.",
    "keywords": "group a few values together without declaring a class. (string name, int age) syntax gives tuple elements meaningful names deconstruction works on tuples, records, and any type with a matching deconstruct method prefer a record over a tuple once the grouping has real behavior or is used widely value tuples let you return or group multiple values with named elements without declaring a dedicated type \u2014 handy for small, internal groupings that don't warrant a full class or record. the syntax (string name, int age) gives each element a readable name instead of relying on .item1 , .item2 . deconstruction unpacks a tuple \u2014 or any type with a matching deconstruct method, including records \u2014 into separate variables in one statement."
  },
  {
    "id": "methods-parameters",
    "tagline": "ref, out, in, optional parameters, and overloading.",
    "keywords": "ref, out, in, optional parameters, and overloading. ref requires the caller\u2019s variable to already have a value; out does not, but must be assigned inside the method in passes by reference but prevents the method from modifying the argument overloads are distinguished by parameter type/count, not by return type alone parameters pass by value by default \u2014 the method gets its own copy. ref lets a method modify the caller's variable directly, out is similar but doesn't require the caller to initialize the variable first (it must be assigned inside the method), and in passes by reference as read-only, avoiding a copy for large structs without allowing mutation. optional parameters let callers omit arguments that have a default value, and method overloading lets you define several methods with the same name distinguished by their parameter list."
  },
  {
    "id": "type-casting",
    "tagline": "Implicit vs. explicit conversion, and safely checking types with is/as.",
    "keywords": "implicit vs. explicit conversion, and safely checking types with is/as. implicit conversions never lose data; explicit casts might, so the compiler requires you to opt in as returns null on failure instead of throwing an exception is pattern-matches a type and can bind the result to a new variable in one step conversions that can't lose data ( int to long ) happen implicitly . conversions that might lose data ( double to int ) require an explicit cast \u2014 you're telling the compiler you accept the risk. the as operator attempts a reference conversion and returns null on failure instead of throwing. is checks a type without converting at all, and can bind the result to a new variable in the same expression."
  },
  {
    "id": "string-interpolation",
    "tagline": "Building readable strings with $\"...\" and format specifiers.",
    "keywords": "building readable strings with $\"...\" and format specifiers. any expression can go inside the { } of an interpolated string, not just a variable format specifiers (:c, :f2, :n0, :yyyy-mm-dd) control the exact rendering raw string literals (\"\"\"...\"\"\"), covered separately, pair well with interpolation for multi-line text string interpolation ( $\"...\" ) embeds expressions directly inside a string literal, replacing verbose string.format calls or concatenation. any expression can go inside the braces, not just a variable name. format specifiers after a colon control exactly how a value renders \u2014 :c for currency, :f2 for two decimal places, :yyyy-mm-dd for a date pattern."
  },
  {
    "id": "nullable-value-types",
    "tagline": "Let value types represent \"no value\" without a sentinel.",
    "keywords": "let value types represent \"no value\" without a sentinel. int? is shorthand for nullable<int>; works for any struct, not just int hasvalue/value or ?? are the safe ways to read a nullable value type distinct from nullable reference types, which apply to classes, not structs value types like int or bool can't normally be null \u2014 they always hold a value. nullable&lt;t&gt; (written as t? , e.g. int? ) wraps a value type so it can also represent \"no value\", which is common for things like an optional age or a database column that allows null. use .hasvalue and .value to check and unwrap safely, the ?? null-coalescing operator to supply a default, or pattern matching. accessing .value on a null instance throws invalidoperationexception ."
  },
  {
    "id": "boxing-unboxing",
    "tagline": "The hidden cost of treating a value type as an object.",
    "keywords": "the hidden cost of treating a value type as an object. boxing allocates a heap object to hold a copy of a value type unboxing requires an exact type match or it throws invalidcastexception generics (list<t> vs arraylist) avoid boxing and its allocation overhead boxing copies a value type (like int or a struct ) onto the heap and wraps it in an object , so it can be used wherever a reference type is expected. unboxing copies it back out into a value-type variable. both are implicit and easy to trigger accidentally \u2014 adding an int to a non-generic arraylist , for example \u2014 and each one allocates memory and copies data. generic collections like list&lt;int&gt; avoid this entirely, which is one reason they replaced non-generic collections."
  },
  {
    "id": "classes-objects",
    "tagline": "The blueprint (class) and the instance (object).",
    "keywords": "the blueprint (class) and the instance (object). properties can have different access levels for get vs set object initializers set properties without a custom constructor this refers to the current instance inside a method a class defines the shape of something \u2014 its fields, properties, and methods. an object is a concrete instance created from that blueprint with new . properties (using get / set ) expose a class's state while letting you control how it's read or written. constructors initialize a new object's state; c# also supports object initializer syntax to set public properties inline at creation time."
  },
  {
    "id": "inheritance",
    "tagline": "Sharing behavior through a base class.",
    "keywords": "sharing behavior through a base class. only virtual/abstract members can be overridden base.method() invokes the parent version explicitly c# has single class inheritance, but multiple interface implementation a class can inherit from a single base class using a colon, gaining its public and protected members. override lets a derived class replace a base method marked virtual , while base.method() calls the original implementation from within the override. c# supports single inheritance only \u2014 a class can extend one base class, but implement multiple interfaces (see the interfaces topic)."
  },
  {
    "id": "interfaces",
    "tagline": "A contract for what a type can do, not how.",
    "keywords": "a contract for what a type can do, not how. a class can implement multiple interfaces interfaces enable loose coupling and easier unit testing since c# 8, interfaces can include default method implementations an interface declares members without implementing them \u2014 it's a contract. any class or struct that implements the interface must provide the implementation. a single class can implement any number of interfaces, which is how c# achieves multiple-inheritance-like flexibility. interfaces are the backbone of dependency injection and testability: code that depends on ilogger rather than a concrete filelogger can be swapped or mocked freely."
  },
  {
    "id": "polymorphism",
    "tagline": "One interface, many implementations.",
    "keywords": "one interface, many implementations. runtime dispatch picks the correct override based on the actual object type enables adding new types without modifying existing consuming code works through both base classes and interfaces polymorphism means you can treat different concrete types uniformly through a shared base type or interface. a list&lt;ishape&gt; can hold circles, squares, and triangles, and calling .area() on each dispatches to the correct implementation at runtime \u2014 this is runtime (dynamic) dispatch . this is what makes code extensible: you can add a new shape type without touching the code that iterates over shapes."
  },
  {
    "id": "encapsulation",
    "tagline": "Controlling access with public, private, and protected.",
    "keywords": "controlling access with public, private, and protected. private fields with public properties let you validate before mutating state protected exposes members to subclasses but not the outside world encapsulation reduces the surface area that other code can break encapsulation means hiding internal state and exposing only what's needed. c# controls this with access modifiers: private (this class only), protected (this class and subclasses), internal (this assembly), and public (anyone). a common pattern is a private backing field with a public property that validates input before allowing a change, keeping the object always in a valid state."
  },
  {
    "id": "abstract-classes",
    "tagline": "Partial blueprints that can\u2019t be instantiated directly.",
    "keywords": "partial blueprints that can\u2019t be instantiated directly. abstract classes can have both implemented and abstract members cannot be instantiated directly \u2014 only through a derived class choose abstract class over interface when subclasses share real state or logic an abstract class can mix implemented members with abstract members that have no body \u2014 subclasses are required to implement them. unlike an interface, an abstract class can hold shared state and constructor logic, making it a good fit when related types share real behavior, not just a contract. you cannot create an instance of an abstract class directly with new ; it only exists to be extended."
  },
  {
    "id": "static-members",
    "tagline": "Belongs to the type itself, not to any instance.",
    "keywords": "belongs to the type itself, not to any instance. static fields/state are shared across every part of the program that touches the type static classes cannot be instantiated and cannot have instance members instance members can access static members, but not vice versa without an instance a static member belongs to the type, not to any particular object \u2014 there's exactly one copy, shared across every use of that type in the program. a static class (like math or console ) can't be instantiated at all; it exists purely to group related static functionality. instance members can freely access static members, but static members can't access instance members without being handed a specific instance to work with."
  },
  {
    "id": "indexers",
    "tagline": "Let your own type be accessed with [] like an array.",
    "keywords": "let your own type be accessed with [] like an array. defined with the this keyword instead of a method name can be overloaded with different parameter types (e.g. int and string) supports both get and set, just like a property an indexer lets instances of your class be accessed with array-like bracket syntax ( myobject[key] ) instead of a named method like getitem(key) . it's how types like list&lt;t&gt; and dictionary&lt;k,v&gt; support the [] syntax you already use every day. an indexer is defined with the this keyword in place of a method name, and \u2014 like a property \u2014 can expose both a get and a set accessor."
  },
  {
    "id": "operator-overloading",
    "tagline": "Define what +, ==, and other operators mean for your own type.",
    "keywords": "define what +, ==, and other operators mean for your own type. defined as public static methods using the operator keyword if you overload == you should also overload != and override equals/gethashcode use sparingly \u2014 only when the operator\u2019s meaning is genuinely obvious for the type c# lets you overload operators like + , - , == , and != for your own types using the operator keyword, so instances can be combined with the same syntax as built-in numeric types. this is especially natural for value-like types such as a money or vector struct, where \"adding two of them together\" has an obvious meaning. use it sparingly \u2014 only when the operator's meaning is genuinely unambiguous for the type; overloading + to do something unrelated to addition just confuses readers."
  },
  {
    "id": "object-equality",
    "tagline": "== vs. Equals(), and why overriding one usually means overriding both.",
    "keywords": "== vs. equals(), and why overriding one usually means overriding both. records get value-based equals/gethashcode/== automatically; plain classes don\u2019t if you override equals, you must also override gethashcode two objects that are equal must always return the same gethashcode for reference types, == compares references by default \u2014 are these the exact same object in memory? equals can be overridden to compare by value instead. records get this value-based behavior automatically; plain classes don't unless you write it yourself. if you override equals , you must also override gethashcode \u2014 two objects considered equal must always produce the same hash code, or collections like dictionary and hashset will behave incorrectly."
  },
  {
    "id": "sealed",
    "tagline": "Prevent further inheritance or overriding.",
    "keywords": "prevent further inheritance or overriding. a sealed class cannot be a base class for any other class sealed override locks in one member\u2019s implementation while leaving the class itself inheritable common for small, complete value-like types \u2014 many built-in .net types are sealed marking a class sealed prevents any other class from inheriting from it \u2014 useful once a type's design shouldn't be extended further, and it lets the jit apply certain optimizations since it knows no override can exist elsewhere. you can also apply sealed override to an individual member in a derived class, locking that one member's implementation in place while still allowing further subclasses of the derived class itself."
  },
  {
    "id": "object-initializers",
    "tagline": "Set properties right where you construct the object.",
    "keywords": "set properties right where you construct the object. object initializers run after the constructor, assigning properties in order avoids writing a constructor overload for every combination of properties works with nested objects and collections too: new order { items = { ... } } an object initializer lets you set public properties or fields immediately after construction, in a single expression, without writing a matching constructor overload for every combination of values. it's syntactic sugar: the compiler still calls the constructor first (parameterless unless you specify one), then assigns each property in order. it pairs well with init -only properties when you want the object immutable after that point."
  },
  {
    "id": "method-overloading",
    "tagline": "Same method name, different signatures, resolved at compile time.",
    "keywords": "same method name, different signatures, resolved at compile time. overloads must differ in parameter type, count, or order \u2014 not just return type resolved at compile time based on the argument types passed in different from overriding, which keeps the same signature across a hierarchy method overloading lets a class expose multiple methods with the same name as long as their parameter lists differ \u2014 in number, order, or type. the compiler picks which one to call based on the arguments at the call site, so there's no runtime lookup cost. this differs from overriding (which changes behavior of an inherited method with the same signature) \u2014 overloading changes the signature itself to offer convenient variations of the same operation."
  },
  {
    "id": "generics",
    "tagline": "Write one algorithm that works across many types, safely.",
    "keywords": "write one algorithm that works across many types, safely. generics give type safety without duplicating code per type constraints (where t : ...) unlock operations on the generic type avoids boxing/unboxing overhead that untyped collections had generics let you parameterize a class or method by type, so list&lt;t&gt; works identically whether t is int , string , or a custom class \u2014 without boxing value types or casting objects, and with full compile-time type checking. constraints ( where t : icomparable&lt;t&gt; ) restrict what t can be, letting you call members on t that the compiler otherwise couldn't guarantee exist."
  },
  {
    "id": "delegates-events",
    "tagline": "Type-safe references to methods, and the pub/sub pattern built on them.",
    "keywords": "type-safe references to methods, and the pub/sub pattern built on them. action<t> and func<t,tresult> cover most delegate use cases without a custom delegate type events restrict outside code to only += and -=, not direct invocation multiple methods can subscribe to the same event (multicast) a delegate is a type-safe function pointer \u2014 a variable that holds a reference to a method matching a given signature. action and func are built-in generic delegate types for the common cases of \"no return value\" and \"returns a value.\" an event wraps a delegate to implement publish/subscribe: a class exposes an event, other code subscribes with += , and the class invokes it when something happens \u2014 without the subscribers needing a reference to each other."
  },
  {
    "id": "linq",
    "tagline": "Query collections declaratively, like SQL for in-memory data.",
    "keywords": "query collections declaratively, like sql for in-memory data. linq queries are lazily evaluated until enumerated method syntax (.where().select()) and query syntax (from...where...select) are equivalent works over in-memory collections, xml, and ef core database queries linq (language integrated query) adds query operators like where , select , orderby , and groupby directly onto any ienumerable&lt;t&gt; . these are lazily evaluated \u2014 nothing runs until you actually enumerate the result, e.g. with foreach or .tolist() . linq works identically over in-memory collections, xml, and (via ef core) sql databases, which is why it's worth learning early \u2014 the same mental model applies everywhere."
  },
  {
    "id": "exceptions",
    "tagline": "try/catch/finally and when to throw.",
    "keywords": "try/catch/finally and when to throw. catch specific exception types before general ones finally always runs, whether or not an exception occurred prefer exceptions for truly exceptional cases, not expected branching c# uses exceptions for error conditions that are exceptional, not for routine control flow. a try block runs code that might fail; matching catch blocks handle specific exception types; finally always runs, making it the right place for cleanup like closing a file. catch specific exception types before general ones \u2014 catching the base exception type first would swallow everything, hiding bugs you actually want to see."
  },
  {
    "id": "extension-methods",
    "tagline": "Add methods to a type you don\u2019t own.",
    "keywords": "add methods to a type you don\u2019t own. defined as static methods in a static class, first param uses this called as if they were instance methods on the extended type linq\u2019s entire operator set is implemented this way extension methods let you \"add\" a method to an existing type \u2014 even one from the .net framework you can't modify \u2014 by defining a static method in a static class where the first parameter is prefixed with this . linq itself is implemented entirely as extension methods on ienumerable&lt;t&gt; , which is why .where() appears to be a method on every collection type."
  },
  {
    "id": "idisposable-using",
    "tagline": "Deterministic cleanup for limited or unmanaged resources.",
    "keywords": "deterministic cleanup for limited or unmanaged resources. dispose() should be safe to call more than once using ensures dispose runs even when an exception occurs inside the block a using declaration (no braces) disposes at the end of the enclosing scope types that hold onto a limited resource \u2014 a file handle, a network connection, a database connection \u2014 implement idisposable so callers can release it deterministically, rather than waiting for the garbage collector to eventually get around to it. the using statement guarantees dispose() runs when the block ends, even if an exception is thrown inside it. a using declaration (no braces) does the same thing, disposing at the end of the enclosing scope instead."
  },
  {
    "id": "iterators-yield",
    "tagline": "Generate a sequence lazily, one item at a time.",
    "keywords": "generate a sequence lazily, one item at a time. yield return produces the next element and pauses the method until the next item is requested the method\u2019s local variables and loop position are preserved between calls automatically enables infinite sequences, since only the items actually consumed are ever computed the yield return keyword lets you write a method that produces an ienumerable&lt;t&gt; without building the whole collection up front. each call to the enumerator's movenext() resumes the method exactly where it left off, with all local state preserved automatically. this makes it possible to lazily generate expensive or even infinite sequences, since only the items actually consumed are ever computed."
  },
  {
    "id": "attributes",
    "tagline": "Attach declarative metadata that tools or the runtime can read.",
    "keywords": "attach declarative metadata that tools or the runtime can read. attributes describe code; they don\u2019t run unless something reads them via reflection built-in attributes like [obsolete] are understood directly by the compiler a custom attribute is just a class deriving from system.attribute attributes attach metadata to a type, method, or property without changing its behavior directly \u2014 [obsolete] , [serializable] , and validation attributes like [required] are all built-in examples. the compiler understands some attributes directly; others are read by libraries or your own code via reflection. a custom attribute is simply a class that derives from system.attribute ."
  },
  {
    "id": "reflection",
    "tagline": "Inspect and invoke types at runtime, not just compile time.",
    "keywords": "inspect and invoke types at runtime, not just compile time. typeof(t) or obj.gettype() gets a type object describing a type's shape getproperties/getmethods enumerate members; invoke calls them dynamically powers frameworks (di, serializers, orms) but is slower than direct calls reflection (in the system.reflection namespace) lets code examine assemblies, types, and members \u2014 and invoke methods or set properties \u2014 at runtime, even ones it didn't know about at compile time. it's the mechanism behind serializers, dependency injection containers, and orms like entity framework. it's powerful but comes with real costs: it's slower than direct calls, bypasses some compile-time safety, and can complicate trimming/aot-compiled apps \u2014 so it's typically reached for in framework code, not everyday application logic."
  },
  {
    "id": "dependency-injection",
    "tagline": "Ask for what you need instead of constructing it yourself.",
    "keywords": "ask for what you need instead of constructing it yourself. classes depend on abstractions (interfaces), not concrete implementations a container resolves and supplies dependencies, usually via the constructor asp.net core has di built in: addsingleton, addscoped, addtransient dependency injection (di) is a technique where a class declares the services it depends on (usually via constructor parameters) instead of creating them internally with new . something external \u2014 a di container \u2014 is responsible for supplying the right implementation. this decouples code from concrete implementations, making it easy to swap a real service for a test double, and is built directly into asp.net core via iservicecollection , with common lifetimes of singleton , scoped , and transient ."
  },
  {
    "id": "regular-expressions",
    "tagline": "Pattern-match and extract text with the Regex class.",
    "keywords": "pattern-match and extract text with the regex class. regex.ismatch tests, match/matches extract, regex.replace substitutes named groups (?<year>\\d{4}) make extracted captures easier to read [generatedregex] compiles the pattern at build time for better performance the system.text.regularexpressions namespace exposes the regex class for pattern matching: testing whether a string matches a pattern, extracting captured groups, or replacing matched text. since .net 7, the [generatedregex] source generator can produce a compiled, aot-friendly regex at build time instead of parsing the pattern at runtime \u2014 faster for patterns used repeatedly, such as validating input in a hot path."
  },
  {
    "id": "json-serialization",
    "tagline": "Convert objects to JSON and back with System.Text.Json.",
    "keywords": "convert objects to json and back with system.text.json. jsonserializer.serialize/deserialize are the core built-in apis jsonserializeroptions controls casing, indentation, and null handling source-generated contexts avoid reflection for better startup/aot performance system.text.json is the built-in serializer for converting .net objects to and from json, replacing the older third-party newtonsoft.json for most scenarios. jsonserializer.serialize and deserialize handle the conversion, and attributes like [jsonpropertyname] or options like propertynamingpolicy control the shape of the json. for high-performance or trimmed/aot scenarios, source-generated serialization (a jsonserializercontext ) avoids reflection entirely by generating the (de)serialization code at build time."
  },
  {
    "id": "async-await",
    "tagline": "Non-blocking code that reads like synchronous code.",
    "keywords": "non-blocking code that reads like synchronous code. await frees the thread while waiting, it does not block it async methods should return task or task<t>, avoid async void exceptions inside an async method surface when the task is awaited marking a method async lets you use await inside it to pause execution until a task completes \u2014 without blocking the calling thread. this is essential for i/o-bound work like network calls or file access, where blocking a thread while waiting would waste resources. an async method typically returns task or task&lt;t&gt; rather than void , so callers can await it and observe exceptions properly."
  },
  {
    "id": "tpl",
    "tagline": "Running independent work concurrently.",
    "keywords": "running independent work concurrently. task.whenall runs independent tasks concurrently, not sequentially task.run is for cpu-bound work; plain async/await suits i/o-bound work awaiting tasks one-by-one in a loop loses the concurrency benefit task.whenall runs multiple independent async operations concurrently and completes once they all finish \u2014 much faster than awaiting them one at a time when they don't depend on each other. use task.run to offload cpu-bound work onto a background thread pool thread; use plain async/await (no task.run) for i/o-bound work, since it doesn't need a dedicated thread while waiting."
  },
  {
    "id": "threading-basics",
    "tagline": "Shared state needs coordination.",
    "keywords": "shared state needs coordination. lock prevents two threads from entering the same block simultaneously interlocked.increment is a lightweight atomic alternative for simple counters unsynchronized shared state is a common source of subtle, hard-to-reproduce bugs when multiple threads write to shared state, you need synchronization to avoid race conditions \u2014 two threads reading-then-writing the same variable can lose an update. the lock keyword ensures only one thread executes a block at a time. for simple counters, interlocked operations are faster than a full lock, performing the increment atomically at the hardware level."
  },
  {
    "id": "cancellation-token",
    "tagline": "Cooperative cancellation for long-running or async work.",
    "keywords": "cooperative cancellation for long-running or async work. cancellation is cooperative \u2014 the running code must check the token itself cancellationtokensource creates the token and triggers cancellation passing the token into task.delay, http calls, etc. lets .net apis cancel themselves for you a cancellationtoken lets calling code signal \"stop what you're doing\" to an async operation, without forcibly killing a thread. the running code checks the token periodically \u2014 or passes it to another cancellable api like task.delay \u2014 and exits cleanly when cancellation is requested, typically by throwing an operationcanceledexception . cancellation is cooperative : nothing stops automatically unless the running code actually checks the token."
  },
  {
    "id": "async-streams",
    "tagline": "await foreach over a sequence produced asynchronously, one item at a time.",
    "keywords": "await foreach over a sequence produced asynchronously, one item at a time. declared as async iasyncenumerable<t> and uses yield return inside consumed with await foreach, not a plain foreach ideal for streaming results (e.g. paged api responses) instead of loading everything into memory first iasyncenumerable&lt;t&gt; combines yield return with async , letting a method produce items one at a time where producing each item involves an async operation, like a paged api call. the consumer uses await foreach to process each item as it arrives, instead of waiting for the entire sequence to be ready first. this is ideal for streaming results without loading everything into memory up front."
  },
  {
    "id": "semaphore-slim",
    "tagline": "Limit how many tasks can access a resource at once.",
    "keywords": "limit how many tasks can access a resource at once. semaphoreslim(n) allows up to n concurrent callers through wait/waitasync waitasync() doesn't block a thread, unlike lock \u2014 ideal for async throttling always release() in a finally block to avoid permanently starving other callers while lock allows only one thread in at a time, semaphoreslim allows a configurable number of concurrent callers \u2014 useful for throttling access to a limited resource, like capping how many http requests run in parallel. unlike lock , it has an async-friendly waitasync() that doesn't block a thread while waiting, making it the right choice for throttling concurrent async work rather than raw multithreading."
  },
  {
    "id": "channels",
    "tagline": "A thread-safe queue built for async producer/consumer code.",
    "keywords": "a thread-safe queue built for async producer/consumer code. channel<t> is a thread-safe, async-friendly producer/consumer queue readallasync() as an await foreach consumes items as they arrive bounded channels apply backpressure, pausing writers when the buffer is full system.threading.channels provides channel&lt;t&gt; , an async-first queue for passing data between a producer and one or more consumers without manual locking. a writer calls writeasync , and a reader awaits items with readallasync , which naturally backs off when the channel is empty. bounded channels can also apply backpressure \u2014 if the channel is full, writeasync waits, which keeps a fast producer from overwhelming a slower consumer."
  },
  {
    "id": "records",
    "tagline": "Immutable, value-based data types with almost no boilerplate.",
    "keywords": "immutable, value-based data types with almost no boilerplate. records compare by value, classes compare by reference by default with expressions produce a copy with specific properties changed best suited to data that represents a snapshot rather than a mutable entity a record is designed for modeling immutable data. it gets value-based equality (two records are equal if their properties match, unlike classes which compare references), a generated tostring() , and a compact constructor syntax for free. with expressions create a modified copy without mutating the original \u2014 useful for immutable update patterns common in functional-style code."
  },
  {
    "id": "pattern-matching",
    "tagline": "Testing shape and structure, not just equality.",
    "keywords": "testing shape and structure, not just equality. type patterns test and cast in a single step: obj is string s property patterns match on an object\u2019s field values directly combines cleanly with switch expressions for multi-branch logic pattern matching goes beyond checking if a value equals something \u2014 it can test a value's type , its properties , and its shape all in one expression. combined with switch expressions, this replaces a lot of nested if/else type-checking code. property patterns (matching on an object's field values) and relational patterns (&lt;, &gt;=, etc.) can be combined for expressive, readable conditions."
  },
  {
    "id": "nullable-reference-types",
    "tagline": "Letting the compiler catch null-reference bugs before runtime.",
    "keywords": "letting the compiler catch null-reference bugs before runtime. string means non-null, string? means nullable, once the feature is enabled purely a compile-time warning system, not a runtime guard enabled by default in new project templates since .net 6 with nullable reference types enabled (the default in new projects), string means \"never null\" while string? explicitly allows null. the compiler then warns you at build time if you dereference something that could be null without checking first. this doesn't add a runtime check \u2014 it's a compile-time analysis that turns a common source of nullreferenceexception crashes into a build warning you see immediately."
  },
  {
    "id": "file-scoped-namespaces",
    "tagline": "One namespace per file, without an extra indentation level (C# 10).",
    "keywords": "one namespace per file, without an extra indentation level (c# 10). namespace foo; (with a semicolon, no braces) applies to the whole file only one file-scoped namespace is allowed per file purely a formatting improvement \u2014 behaves identically to the braced form a file-scoped namespace declaration ( namespace myapp.models; ) applies to the entire file without needing braces or an extra indent level for every type inside it. since most files only declare one namespace anyway, this removes a layer of purely cosmetic nesting from nearly every c# file in a typical project. it behaves identically to the traditional braced form \u2014 this is a formatting improvement, not a new capability."
  },
  {
    "id": "raw-string-literals",
    "tagline": "Embed quotes and backslashes without escaping (C# 11).",
    "keywords": "embed quotes and backslashes without escaping (c# 11). delimited by three or more consecutive double quotes contents are taken completely literally \u2014 no escaping needed for \" or \\\\ combine with $ for raw interpolated strings: $\"\"\"...{expr}...\"\"\" a raw string literal , delimited by three or more double quotes, lets you embed characters like \" and \\ literally, with no escape sequences needed \u2014 especially useful for json, regex patterns, and file paths. combine it with $ for a raw interpolated string ( $\"\"\"...\"\"\" ) to get all the benefits of interpolation without fighting escape characters."
  },
  {
    "id": "generic-math",
    "tagline": "Write one algorithm that works across every numeric type (C# 11).",
    "keywords": "write one algorithm that works across every numeric type (c# 11). static abstract members on an interface can be operators, not just regular methods all built-in numeric types implement inumber<t> and related interfaces removes the old need to duplicate numeric algorithms per type static abstract interface members let an interface declare a static member \u2014 including an operator \u2014 that every implementing type must provide. .net's built-in numeric types ( int , double , decimal ...) all implement inumber&lt;t&gt; , so a single generic method constrained to inumber&lt;t&gt; works identically whether it's summing ints, doubles, or decimals. this removes the old need to duplicate numeric algorithms per type, or fall back to a slower, non-generic shared base type like double ."
  },
  {
    "id": "init-only-properties",
    "tagline": "Settable during construction, read-only ever after.",
    "keywords": "settable during construction, read-only ever after. init behaves like set, but only inside a constructor or object initializer combines object-initializer syntax with true post-construction immutability records use init-only properties under the hood for their positional parameters an init accessor, introduced in c# 9, works like set but can only be called during object initialization \u2014 in the constructor or an object initializer. after that, the property is effectively read-only. this gives you the convenience of object-initializer syntax while still producing genuinely immutable objects, which is exactly what the compiler generates for you automatically in a record 's positional properties."
  },
  {
    "id": "top-level-statements",
    "tagline": "Skip the boilerplate Main method and class wrapper.",
    "keywords": "skip the boilerplate main method and class wrapper. the compiler generates the main method and program class implicitly only one file in a project can use top-level statements args and async main (via top-level await) both still work as expected top-level statements , introduced in c# 9, let a program's entry point be written directly in a file without an explicit class program or static void main \u2014 the compiler generates them for you behind the scenes. this is what new console and minimal-api asp.net core projects use by default. only one file per project may contain top-level statements, and command-line arguments are still available through the implicit args variable. it's purely a readability convenience \u2014 the compiled output is identical to the traditional form."
  },
  {
    "id": "primary-constructors",
    "tagline": "Declare constructor parameters right in the class header (C# 12).",
    "keywords": "declare constructor parameters right in the class header (c# 12). available for classes and structs since c# 12, not only records parameters are in scope for the whole class body, not just field initializers parameters aren\u2019t automatically properties unless you assign them explicitly primary constructors , previously exclusive to records, are available on any class or struct since c# 12. parameters declared in the type header are in scope throughout the whole class body \u2014 not just in field initializers \u2014 so you can use them directly in methods without assigning them to fields first. unlike a record's primary constructor, these parameters don't automatically become public properties \u2014 if you want that, you still assign them explicitly."
  },
  {
    "id": "collection-expressions",
    "tagline": "One bracket syntax for building any collection type (C# 12).",
    "keywords": "one bracket syntax for building any collection type (c# 12). one bracket syntax works across arrays, list<t>, span<t>, and more the spread operator .. inlines another collection\u2019s elements the compiler infers the target type from context, like target-typed new collection expressions let you write [1, 2, 3] to build an array, a list&lt;t&gt; , a span&lt;t&gt; , or any type with a compatible construction pattern \u2014 replacing the mix of new[] { } and new list&lt;t&gt; { } syntax with one consistent form. the spread operator ( .. ) inlines the contents of another collection into a new one, similar to spread syntax in javascript."
  },
  {
    "id": "required-members",
    "tagline": "Force callers to set specific properties at construction time (C# 11).",
    "keywords": "force callers to set specific properties at construction time (c# 11). enforced at compile time, not runtime pairs naturally with init so the property stays immutable after construction lets you use object initializer syntax while still guaranteeing key properties are set the required modifier on a property means an object initializer must set that property, or the code simply won't compile. this closes a long-standing gap \u2014 previously the only way to guarantee a property was set was a constructor parameter, which didn't compose well with object initializer syntax. it pairs naturally with init : the property must be set once at construction, and can't be changed after that."
  },
  {
    "id": "params-collections",
    "tagline": "params now works with Span<T>, List<T>, and more, not just arrays (C# 13).",
    "keywords": "params now works with span<t>, list<t>, and more, not just arrays (c# 13). params readonlyspan<t> avoids the array allocation params t[] always required call sites look identical \u2014 callers don\u2019t need to change anything ienumerable<t>, list<t>, and other collection types are supported too before c# 13, params only accepted an array, which meant every call implicitly allocated a new array on the heap. c# 13 allows any recognized collection type, including span&lt;t&gt; and readonlyspan&lt;t&gt; , letting the compiler avoid that allocation for the common case of passing a handful of values. callers don't need to change anything \u2014 the call site looks identical either way."
  },
  {
    "id": "field-keyword",
    "tagline": "Add logic to one accessor without a manual backing field (C# 14).",
    "keywords": "add logic to one accessor without a manual backing field (c# 14). field refers to the compiler-synthesized backing field \u2014 no manual field declaration needed you can add logic to just get or just set, leaving the other as a plain auto-accessor use @field or this.field if the type already has a member literally named field the field contextual keyword lets you reach the compiler-generated backing field of an auto-property directly inside its accessors. that means you can add validation or normalization to just one accessor without declaring a private backing field and converting the whole thing into a full property. if a type already has a member literally named field , you can disambiguate with @field or this.field ."
  },
  {
    "id": "null-conditional-assignment",
    "tagline": "Use ?. on the left side of an assignment (C# 14).",
    "keywords": "use ?. on the left side of an assignment (c# 14). works with compound assignment too, e.g. += and -= not supported for ++ or -- the right-hand expression isn\u2019t evaluated at all when the receiver is null before c# 14, safely assigning to a property on a possibly-null object required an explicit if check first. null-conditional assignment lets you write customer?.name = \"guest\" directly \u2014 the right-hand side is only evaluated and assigned when the receiver isn't null, and the whole statement is a no-op otherwise. it also works with compound assignment operators like += and -= , though not with ++ or -- ."
  },
  {
    "id": "extension-members",
    "tagline": "Extension blocks add static and instance properties, not just methods (C# 14).",
    "keywords": "extension blocks add static and instance properties, not just methods (c# 14). extension blocks group multiple extension members together for a type supports instance and static properties, in addition to methods existing this-parameter extension methods still work exactly as before traditional extension methods could only add instance methods to an existing type. c# 14 introduces a new extension block syntax that also supports extension properties and static extension members, letting you extend a type more fully without modifying its original definition. existing this -parameter extension methods you've already written keep working exactly as before \u2014 this is purely additive."
  },
  {
    "id": "lock-object",
    "tagline": "A purpose-built Lock type replaces locking on a plain object (C# 13).",
    "keywords": "a purpose-built lock type replaces locking on a plain object (c# 13). lock (system.threading.lock) generates more efficient code than lock (object) existing lock (object) code keeps working unchanged purely a performance/clarity improvement to an existing, familiar pattern c# 13 introduces system.threading.lock , a dedicated type for mutual exclusion that the lock statement now recognizes specially, generating more efficient code than locking on an ordinary object. existing code that locks on a plain object still compiles and works exactly the same way \u2014 this is an opt-in improvement, not a breaking change."
  },
  {
    "id": "singleton",
    "tagline": "Guarantee exactly one instance exists.",
    "keywords": "guarantee exactly one instance exists. a private constructor prevents outside code from creating more instances static readonly fields are initialized once, thread-safely, by the runtime in asp.net core apps, di containers manage singleton lifetime for you the singleton pattern ensures a class has only one instance and gives global access to it \u2014 commonly used for things like configuration or logging where multiple instances would be wasteful or inconsistent. in modern c#, this is usually implemented with a static readonly field, or delegated entirely to a dependency injection container registering the service as \"singleton\" lifetime."
  },
  {
    "id": "factory",
    "tagline": "Centralize object creation logic.",
    "keywords": "centralize object creation logic. calling code depends on the abstraction, not the concrete class centralizes branching creation logic in a single method adding a new variant means changing the factory only, not every call site the factory pattern moves the decision of *which concrete type to create* into one place, so calling code depends only on an interface or base type, not a specific implementation. this makes it easy to add new types later without touching the calling code. it's especially useful when construction involves branching logic (based on config, input, or environment) that would otherwise be duplicated everywhere an object is created."
  },
  {
    "id": "observer",
    "tagline": "One-to-many notification without tight coupling.",
    "keywords": "one-to-many notification without tight coupling. the subject holds no reference to concrete observer types, only the event c# events are effectively observer built into the language any number of observers can subscribe or unsubscribe at runtime the observer pattern lets one object (the subject) notify many dependent objects (observers) when its state changes, without the subject knowing anything concrete about them. c#'s built-in event keyword is a direct, language-level implementation of this pattern. this decouples the source of a change from whatever needs to react to it \u2014 the publisher never needs a reference to the subscriber's type."
  },
  {
    "id": "strategy",
    "tagline": "Swap an algorithm at runtime behind a shared interface.",
    "keywords": "swap an algorithm at runtime behind a shared interface. encapsulates interchangeable algorithms behind one interface lets you choose the algorithm at runtime, e.g. from configuration can be implemented with a full interface, or simply a func<t,tresult> delegate the strategy pattern defines a family of interchangeable algorithms behind a common interface, letting you select or swap the algorithm at runtime rather than hardcoding one path with conditionals. in c#, this often collapses into simply passing a func&lt;t,tresult&gt; delegate instead of defining a full interface with multiple implementing classes \u2014 a lightweight version of the same idea."
  },
  {
    "id": "repository",
    "tagline": "Abstract data access behind a collection-like interface.",
    "keywords": "abstract data access behind a collection-like interface. business logic depends on irepository<t>, never a concrete database class swap in a fake/in-memory implementation for fast unit tests commonly paired with dependency injection to supply the right implementation the repository pattern puts a collection-like interface ( getbyid , add , getall ) in front of your actual data source \u2014 a database, an api, or an in-memory store \u2014 so the rest of your application doesn't know or care which one it's talking to. this is what makes unit testing business logic possible without a real database: you inject an in-memory fake repository during tests, and the real ef core-backed one in production."
  },
  {
    "id": "builder",
    "tagline": "Construct a complex object step by step.",
    "keywords": "construct a complex object step by step. each builder method typically returns the builder itself, enabling method chaining avoids constructors with a long list of optional parameters a final build() call produces the fully configured, often immutable, object the builder pattern separates the construction of a complex object from its final representation, letting you assemble it through a series of chained method calls instead of one enormous constructor. it shines when an object has many optional configuration options, most of which have sensible defaults. each builder method typically returns the builder itself, enabling method chaining , and a final build() call produces the fully configured object."
  },
  {
    "id": "decorator",
    "tagline": "Wrap an object to add behavior without changing its class.",
    "keywords": "wrap an object to add behavior without changing its class. the decorator implements the same interface as the object it wraps multiple decorators can be layered on top of each other avoids a separate subclass for every combination of optional behavior the decorator pattern wraps an object in another object implementing the same interface, adding behavior before or after delegating to the wrapped instance. decorators can be stacked , letting you compose behavior \u2014 logging, caching, retry logic \u2014 without a combinatorial explosion of subclasses for every combination. the key requirement: the decorator implements the exact same interface as the thing it wraps, so callers can't tell the difference."
  },
  {
    "id": "adapter",
    "tagline": "Make an incompatible interface fit the one you need.",
    "keywords": "make an incompatible interface fit the one you need. adapter translates one interface into another without changing the original common when integrating a third-party or legacy class into your own abstraction differs from decorator, which adds behavior rather than changing the interface the adapter pattern wraps an existing class behind a new interface so it can be used where that interface is expected, without modifying the original class. it's the classic fix for plugging a third-party or legacy api into code written against your own abstraction. unlike decorator, which adds behavior while keeping the same interface, adapter's job is purely translation \u2014 converting one shape of api into another."
  },
  {
    "id": "command",
    "tagline": "Turn a request into an object you can queue, log, or undo.",
    "keywords": "turn a request into an object you can queue, log, or undo. command wraps a request as an object with a common execute() interface decouples the invoker (button, queue) from the receiver that does the work naturally supports queuing, logging, retrying, and undo/redo the command pattern wraps an action and its parameters inside an object implementing a common interface (typically a single execute() method), decoupling the code that invokes an action from the code that knows how to perform it. because the request is now an object, it can be queued, logged, retried, or paired with an undo() method \u2014 this is the pattern behind menu actions, task queues, and undo/redo stacks in editors."
  }
];
