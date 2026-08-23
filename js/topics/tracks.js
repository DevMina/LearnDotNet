// Guided tracks: curated, ordered paths through topics that already exist
// elsewhere in the manifest. A track is purely a sequence of topic ids plus
// a short pitch — it doesn't duplicate or fork topic content, so there's
// nothing to keep in sync beyond making sure every id below still exists
// (validate-topics.mjs checks this).
export const TRACKS = [
  {
    id: 'getting-started',
    title: 'Getting Started with C#',
    description: 'The essentials, in the order most people actually need them: syntax basics, control flow, collections, and your first classes and interfaces.',
    topicIds: [
      'variables-types', 'operators', 'control-flow', 'loops',
      'arrays-collections', 'methods-parameters', 'classes-objects', 'interfaces'
    ]
  },
  {
    id: 'csharp-fundamentals',
    title: 'C# Fundamentals',
    description: 'A complete tour of the language foundations — every data type, operator, control structure, and syntax feature you will use in every C# program you write.',
    topicIds: [
      'variables-types', 'operators', 'control-flow', 'loops',
      'methods-parameters', 'arrays-collections', 'string-interpolation',
      'nullable-value-types', 'enums', 'tuples-deconstruction',
      'type-casting', 'structs', 'boxing-unboxing', 'const-readonly',
      'ref-out-in'
    ]
  },
  {
    id: 'oop-in-csharp',
    title: 'OOP in C#',
    description: 'Object-oriented programming from first principles — classes, inheritance, encapsulation, polymorphism, and the subtler features that make C# OOP powerful in practice.',
    topicIds: [
      'classes-objects', 'encapsulation', 'inheritance', 'polymorphism',
      'abstract-classes', 'interfaces', 'static-members', 'sealed',
      'object-equality', 'operator-overloading', 'indexers',
      'object-initializers', 'method-overloading'
    ]
  },
  {
    id: 'advanced-csharp',
    title: 'Advanced C#',
    description: 'The deeper language features that separate senior C# developers from juniors — Span<T>, expression trees, source generators, reflection, iterators, and more.',
    topicIds: [
      'generics', 'delegates-events', 'extension-methods', 'iterators-yield',
      'idisposable-using', 'attributes', 'reflection', 'expression-trees',
      'span', 'source-generators', 'json-serialization', 'regular-expressions',
      'unit-testing', 'performance-tips', 'clean-architecture'
    ]
  },
  {
    id: 'async-deep-dive',
    title: 'Async & Concurrency Deep Dive',
    description: 'From your first await to real concurrency control — task orchestration, cancellation, locking, and the newer streaming/channel-based tools.',
    topicIds: [
      'async-await', 'valuetask', 'tpl', 'threading-basics', 'cancellation-token',
      'semaphore-slim', 'channels', 'async-streams'
    ]
  },
  {
    id: 'design-patterns-essentials',
    title: 'Design Patterns Essentials',
    description: 'The patterns worth knowing first: how to control object creation, decouple behavior, and wrap incompatible interfaces — with runnable C# examples of each.',
    topicIds: [
      'singleton', 'factory', 'observer', 'strategy',
      'decorator', 'adapter', 'repository', 'command', 'builder'
    ]
  },
  {
    id: 'modern-csharp',
    title: 'Modern C# Features',
    description: 'What changed across C# 8–14 and recent .NET versions — records, pattern matching, nullable annotations, primary constructors, collection expressions, and more.',
    topicIds: [
      'top-level-statements', 'file-scoped-namespaces', 'nullable-reference-types',
      'records', 'init-only-properties', 'pattern-matching', 'raw-string-literals',
      'generic-math', 'primary-constructors', 'collection-expressions',
      'required-members', 'extension-members', 'params-collections',
      'field-keyword', 'null-conditional-assignment', 'lock-object',
      'source-generators', 'expression-trees'
    ]
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep: Core Concepts',
    description: 'The topics that come up most in C# interviews — OOP fundamentals, generics, LINQ, async, exception handling, and memory management — reviewed in a sensible order.',
    topicIds: [
      'classes-objects', 'inheritance', 'polymorphism', 'interfaces',
      'abstract-classes', 'generics', 'linq', 'ienumerable-iqueryable',
      'exceptions', 'delegates-events', 'async-await', 'valuetask',
      'memory-management', 'solid-principles', 'ref-out-in', 'dependency-injection'
    ]
  },
  {
    id: 'aspnet-core-essentials',
    title: 'ASP.NET Core Essentials',
    description: 'Build real web APIs from the ground up — DI, middleware, controllers, validation, authentication, EF Core, and everything in between.',
    topicIds: [
      'dependency-injection', 'middleware', 'controllers', 'model-binding',
      'model-validation', 'exception-handling', 'filters', 'cors',
      'rate-limiting', 'openapi', 'minimal-apis', 'configuration',
      'options-pattern', 'logging', 'authentication', 'jwt',
      'caching', 'background-services', 'ef-core'
    ]
  }
];
