// Lightweight navigation manifest — loaded eagerly so the sidebar, search,
// and landing page render instantly. Full topic content (explanation, code,
// output) lives in separate per-topic files and is loaded on demand via
// loadTopic(), so visiting the site never downloads content for topics the
// person hasn't opened yet.

export const CATEGORIES = [
  {
    "id": "fundamentals",
    "name": "Fundamentals",
    "topics": [
      {
        "id": "variables-types",
        "title": "Variables & Types",
        "file": "./fundamentals/variables-types.js"
      },
      {
        "id": "operators",
        "title": "Operators & Expressions",
        "file": "./fundamentals/operators.js"
      },
      {
        "id": "control-flow",
        "title": "Control Flow",
        "file": "./fundamentals/control-flow.js"
      },
      {
        "id": "loops",
        "title": "Loops",
        "file": "./fundamentals/loops.js"
      },
      {
        "id": "arrays-collections",
        "title": "Arrays & Collections",
        "file": "./fundamentals/arrays-collections.js"
      },
      {
        "id": "structs",
        "title": "Structs",
        "file": "./fundamentals/structs.js"
      },
      {
        "id": "enums",
        "title": "Enums",
        "file": "./fundamentals/enums.js"
      },
      {
        "id": "tuples-deconstruction",
        "title": "Tuples & Deconstruction",
        "file": "./fundamentals/tuples-deconstruction.js"
      },
      {
        "id": "methods-parameters",
        "title": "Methods & Parameters",
        "file": "./fundamentals/methods-parameters.js"
      },
      {
        "id": "type-casting",
        "title": "Type Casting & Conversion",
        "file": "./fundamentals/type-casting.js"
      },
      {
        "id": "string-interpolation",
        "title": "String Interpolation & Formatting",
        "file": "./fundamentals/string-interpolation.js"
      },
      {
        "id": "nullable-value-types",
        "title": "Nullable Value Types",
        "file": "./fundamentals/nullable-value-types.js"
      },
      {
        "id": "boxing-unboxing",
        "title": "Boxing & Unboxing",
        "file": "./fundamentals/boxing-unboxing.js"
      },
      {
        "id": "ref-out-in",
        "title": "ref, out & in Parameters",
        "file": "./fundamentals/ref-out-in.js"
      },
      {
        "id": "const-readonly",
        "title": "const vs readonly",
        "file": "./fundamentals/const-readonly.js"
      }
    ]
  },
  {
    "id": "oop",
    "name": "Object-Oriented Programming",
    "topics": [
      {
        "id": "classes-objects",
        "title": "Classes & Objects",
        "file": "./oop/classes-objects.js"
      },
      {
        "id": "inheritance",
        "title": "Inheritance",
        "file": "./oop/inheritance.js"
      },
      {
        "id": "interfaces",
        "title": "Interfaces",
        "file": "./oop/interfaces.js"
      },
      {
        "id": "polymorphism",
        "title": "Polymorphism",
        "file": "./oop/polymorphism.js"
      },
      {
        "id": "encapsulation",
        "title": "Encapsulation",
        "file": "./oop/encapsulation.js"
      },
      {
        "id": "abstract-classes",
        "title": "Abstract Classes",
        "file": "./oop/abstract-classes.js"
      },
      {
        "id": "static-members",
        "title": "Static Members & Classes",
        "file": "./oop/static-members.js"
      },
      {
        "id": "indexers",
        "title": "Indexers",
        "file": "./oop/indexers.js"
      },
      {
        "id": "operator-overloading",
        "title": "Operator Overloading",
        "file": "./oop/operator-overloading.js"
      },
      {
        "id": "object-equality",
        "title": "Object Equality",
        "file": "./oop/object-equality.js"
      },
      {
        "id": "sealed",
        "title": "Sealed Classes & Members",
        "file": "./oop/sealed.js"
      },
      {
        "id": "object-initializers",
        "title": "Object Initializers",
        "file": "./oop/object-initializers.js"
      },
      {
        "id": "method-overloading",
        "title": "Method Overloading",
        "file": "./oop/method-overloading.js"
      }
    ]
  },
  {
    "id": "intermediate",
    "name": "Intermediate C#",
    "topics": [
      {
        "id": "generics",
        "title": "Generics",
        "file": "./intermediate/generics.js"
      },
      {
        "id": "delegates-events",
        "title": "Delegates & Events",
        "file": "./intermediate/delegates-events.js"
      },
      {
        "id": "linq",
        "title": "LINQ",
        "file": "./intermediate/linq.js"
      },
      {
        "id": "exceptions",
        "title": "Exception Handling",
        "file": "./intermediate/exceptions.js"
      },
      {
        "id": "extension-methods",
        "title": "Extension Methods",
        "file": "./intermediate/extension-methods.js"
      },
      {
        "id": "idisposable-using",
        "title": "IDisposable & using",
        "file": "./intermediate/idisposable-using.js"
      },
      {
        "id": "iterators-yield",
        "title": "Iterators (yield)",
        "file": "./intermediate/iterators-yield.js"
      },
      {
        "id": "dependency-injection",
        "title": "Dependency Injection",
        "file": "./intermediate/dependency-injection.js"
      },
      {
        "id": "json-serialization",
        "title": "JSON Serialization",
        "file": "./intermediate/json-serialization.js"
      },
      {
        "id": "unit-testing",
        "title": "Unit Testing",
        "file": "./intermediate/unit-testing.js"
      },
      {
        "id": "solid-principles",
        "title": "SOLID Principles",
        "file": "./intermediate/solid-principles.js"
      },
      {
        "id": "memory-management",
        "title": "Memory Management",
        "file": "./intermediate/memory-management.js"
      },
      {
        "id": "ienumerable-iqueryable",
        "title": "IEnumerable vs IQueryable",
        "file": "./intermediate/ienumerable-iqueryable.js"
      }
    ]
  },
  {
    "id": "advanced",
    "name": "Advanced C#",
    "topics": [
      {
        "id": "attributes",
        "title": "Attributes",
        "file": "./intermediate/attributes.js"
      },
      {
        "id": "reflection",
        "title": "Reflection",
        "file": "./intermediate/reflection.js"
      },
      {
        "id": "regular-expressions",
        "title": "Regular Expressions",
        "file": "./intermediate/regular-expressions.js"
      },
      {
        "id": "clean-architecture",
        "title": "Clean Architecture",
        "file": "./intermediate/clean-architecture.js"
      },
      {
        "id": "performance-tips",
        "title": "Performance Tips",
        "file": "./intermediate/performance-tips.js"
      },
      {
        "id": "span",
        "title": "Span<T> & Memory<T>",
        "file": "./intermediate/span.js"
      },
      {
        "id": "expression-trees",
        "title": "Expression Trees",
        "file": "./intermediate/expression-trees.js"
      },
      {
        "id": "source-generators",
        "title": "Source Generators",
        "file": "./intermediate/source-generators.js"
      }
    ]
  },
  {
    "id": "async",
    "name": "Async & Concurrency",
    "topics": [
      {
        "id": "async-await",
        "title": "async / await",
        "file": "./async/async-await.js"
      },
      {
        "id": "tpl",
        "title": "Task Parallel Library",
        "file": "./async/tpl.js"
      },
      {
        "id": "threading-basics",
        "title": "Threading Basics",
        "file": "./async/threading-basics.js"
      },
      {
        "id": "cancellation-token",
        "title": "CancellationToken",
        "file": "./async/cancellation-token.js"
      },
      {
        "id": "async-streams",
        "title": "IAsyncEnumerable & Async Streams",
        "file": "./async/async-streams.js"
      },
      {
        "id": "semaphore-slim",
        "title": "SemaphoreSlim",
        "file": "./async/semaphore-slim.js"
      },
      {
        "id": "channels",
        "title": "Channels",
        "file": "./async/channels.js"
      },
      {
        "id": "valuetask",
        "title": "ValueTask",
        "file": "./async/valuetask.js"
      }
    ]
  },
  {
    "id": "modern-dotnet",
    "name": "Modern .NET",
    "topics": [
      {
        "id": "records",
        "title": "Records",
        "file": "./modern-dotnet/records.js"
      },
      {
        "id": "pattern-matching",
        "title": "Pattern Matching",
        "file": "./modern-dotnet/pattern-matching.js"
      },
      {
        "id": "nullable-reference-types",
        "title": "Nullable Reference Types",
        "file": "./modern-dotnet/nullable-reference-types.js"
      },
      {
        "id": "file-scoped-namespaces",
        "title": "File-Scoped Namespaces",
        "file": "./modern-dotnet/file-scoped-namespaces.js"
      },
      {
        "id": "raw-string-literals",
        "title": "Raw String Literals",
        "file": "./modern-dotnet/raw-string-literals.js"
      },
      {
        "id": "generic-math",
        "title": "Generic Math",
        "file": "./modern-dotnet/generic-math.js"
      },
      {
        "id": "init-only-properties",
        "title": "Init-Only Properties",
        "file": "./modern-dotnet/init-only-properties.js"
      },
      {
        "id": "top-level-statements",
        "title": "Top-Level Statements",
        "file": "./modern-dotnet/top-level-statements.js"
      }
    ]
  },
  {
    "id": "csharp-latest",
    "name": "C# 12–14 Highlights",
    "topics": [
      {
        "id": "primary-constructors",
        "title": "Primary Constructors",
        "file": "./csharp-latest/primary-constructors.js"
      },
      {
        "id": "collection-expressions",
        "title": "Collection Expressions",
        "file": "./csharp-latest/collection-expressions.js"
      },
      {
        "id": "required-members",
        "title": "Required Members",
        "file": "./csharp-latest/required-members.js"
      },
      {
        "id": "params-collections",
        "title": "Params Collections",
        "file": "./csharp-latest/params-collections.js"
      },
      {
        "id": "field-keyword",
        "title": "The field Keyword",
        "file": "./csharp-latest/field-keyword.js"
      },
      {
        "id": "null-conditional-assignment",
        "title": "Null-Conditional Assignment",
        "file": "./csharp-latest/null-conditional-assignment.js"
      },
      {
        "id": "extension-members",
        "title": "Extension Members",
        "file": "./csharp-latest/extension-members.js"
      },
      {
        "id": "lock-object",
        "title": "The Lock Object",
        "file": "./csharp-latest/lock-object.js"
      }
    ]
  },
  {
    "id": "patterns",
    "name": "Design Patterns",
    "topics": [
      {
        "id": "singleton",
        "title": "Singleton",
        "file": "./patterns/singleton.js"
      },
      {
        "id": "factory",
        "title": "Factory",
        "file": "./patterns/factory.js"
      },
      {
        "id": "observer",
        "title": "Observer",
        "file": "./patterns/observer.js"
      },
      {
        "id": "strategy",
        "title": "Strategy",
        "file": "./patterns/strategy.js"
      },
      {
        "id": "repository",
        "title": "Repository",
        "file": "./patterns/repository.js"
      },
      {
        "id": "builder",
        "title": "Builder",
        "file": "./patterns/builder.js"
      },
      {
        "id": "decorator",
        "title": "Decorator",
        "file": "./patterns/decorator.js"
      },
      {
        "id": "adapter",
        "title": "Adapter",
        "file": "./patterns/adapter.js"
      },
      {
        "id": "command",
        "title": "Command",
        "file": "./patterns/command.js"
      }
    ]
  },
  {
    "id": "aspnet",
    "name": "ASP.NET Core",
    "topics": [
      {
        "id": "middleware",
        "title": "Middleware Pipeline",
        "file": "./aspnet/middleware.js"
      },
      {
        "id": "minimal-apis",
        "title": "Minimal APIs",
        "file": "./aspnet/minimal-apis.js"
      },
      {
        "id": "authentication",
        "title": "Authentication & Authorization",
        "file": "./aspnet/authentication.js"
      },
      {
        "id": "jwt",
        "title": "JWT",
        "file": "./aspnet/jwt.js"
      },
      {
        "id": "background-services",
        "title": "Background Services",
        "file": "./aspnet/background-services.js"
      },
      {
        "id": "caching",
        "title": "Caching",
        "file": "./aspnet/caching.js"
      },
      {
        "id": "logging",
        "title": "Logging",
        "file": "./aspnet/logging.js"
      },
      {
        "id": "configuration",
        "title": "Configuration",
        "file": "./aspnet/configuration.js"
      },
      {
        "id": "options-pattern",
        "title": "Options Pattern",
        "file": "./aspnet/options-pattern.js"
      },
      {
        "id": "controllers",
        "title": "Controllers",
        "file": "./aspnet/controllers.js"
      },
      {
        "id": "model-binding",
        "title": "Model Binding",
        "file": "./aspnet/model-binding.js"
      },
      {
        "id": "model-validation",
        "title": "Model Validation",
        "file": "./aspnet/model-validation.js"
      },
      {
        "id": "exception-handling",
        "title": "Exception Handling & ProblemDetails",
        "file": "./aspnet/exception-handling.js"
      },
      {
        "id": "filters",
        "title": "Filters",
        "file": "./aspnet/filters.js"
      },
      {
        "id": "cors",
        "title": "CORS",
        "file": "./aspnet/cors.js"
      },
      {
        "id": "rate-limiting",
        "title": "Rate Limiting",
        "file": "./aspnet/rate-limiting.js"
      },
      {
        "id": "openapi",
        "title": "OpenAPI / Scalar",
        "file": "./aspnet/openapi.js"
      },
      {
        "id": "ef-core",
        "title": "EF Core",
        "file": "./aspnet/ef-core.js"
      }
    ]
  }
];

// Flat lookup: topicId -> { title, file, category, index in category }
export const TOPIC_INDEX = {};
CATEGORIES.forEach(cat => {
  cat.topics.forEach((t, idx) => {
    TOPIC_INDEX[t.id] = { ...t, category: cat, index: idx };
  });
});

// Every topic across all categories, in order — used for continuous
// prev/next navigation that flows across category boundaries.
export const ALL_TOPICS_FLAT = CATEGORIES.flatMap(cat => cat.topics);

// Dynamically imports the full content module for one topic and returns its
// default export. 'file' paths are resolved relative to this manifest file,
// so it doesn't matter which module calls loadTopic().
export function loadTopic(file) {
  return import(new URL(file, import.meta.url).href).then(m => m.default);
}
