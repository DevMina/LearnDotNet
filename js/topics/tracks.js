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
    id: 'async-deep-dive',
    title: 'Async & Concurrency Deep Dive',
    description: 'From your first await to real concurrency control — task orchestration, cancellation, locking, and the newer streaming/channel-based tools.',
    topicIds: [
      'async-await', 'tpl', 'threading-basics', 'cancellation-token',
      'semaphore-slim', 'channels', 'async-streams'
    ]
  },
  {
    id: 'design-patterns-essentials',
    title: 'Design Patterns Essentials',
    description: 'The patterns worth knowing first: how to control object creation, decouple behavior, and wrap incompatible interfaces — with runnable C# examples of each.',
    topicIds: [
      'singleton', 'factory', 'observer', 'strategy',
      'decorator', 'adapter', 'command'
    ]
  },
  {
    id: 'modern-csharp',
    title: 'Modern C# Features',
    description: 'What changed in recent C#/.NET versions — records, pattern matching, nullable reference types, primary constructors, and collection expressions.',
    topicIds: [
      'records', 'pattern-matching', 'nullable-reference-types', 'init-only-properties',
      'top-level-statements', 'primary-constructors', 'collection-expressions',
      'required-members', 'extension-members'
    ]
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep: Core Concepts',
    description: 'The topics that come up most in C# interviews — OOP fundamentals, generics, LINQ, and exception handling — reviewed in a sensible order.',
    topicIds: [
      'classes-objects', 'inheritance', 'polymorphism', 'interfaces',
      'abstract-classes', 'generics', 'linq', 'exceptions', 'delegates-events'
    ]
  }
];
