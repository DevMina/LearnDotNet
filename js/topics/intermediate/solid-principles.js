export default {
  tagline: "Five principles that keep object-oriented code maintainable as it grows.",
  explanation: `
          <p><strong>SOLID</strong> is an acronym for five design principles: <em>Single Responsibility</em> (a class should have one reason to change), <em>Open/Closed</em> (open for extension, closed for modification), <em>Liskov Substitution</em> (subtypes must be substitutable for their base types), <em>Interface Segregation</em> (prefer small, focused interfaces), and <em>Dependency Inversion</em> (depend on abstractions, not concretions).</p>
          <p>They're not rules to follow mechanically, but heuristics that point toward the same underlying goal: loosely coupled, highly cohesive code that can be extended and tested without cascading changes. Violating one principle typically makes another harder to satisfy too — spotting that tension is often the clearest signal a refactor is needed.</p>
        `,
  keyPoints: [
    "SRP: one reason to change — split classes when they serve two distinct purposes",
    "OCP + DIP: depend on interfaces so new behaviour is added by adding code, not editing it",
    "LSP: a subclass that breaks callers of the base class is a design smell, not just a bug"
  ],
  code: `// Before SRP violation: one class does too much
// public class Report { void Generate() {} void Save() {} void Send() {} }

// After: one reason to change each
public interface IReportFormatter { string Format(Report r); }
public interface IReportSender    { void Send(string content); }

public class ReportService
{
    private readonly IReportFormatter _formatter;
    private readonly IReportSender _sender;

    public ReportService(IReportFormatter f, IReportSender s)
        => (_formatter, _sender) = (f, s);

    public void Publish(Report r)
        => _sender.Send(_formatter.Format(r));
}`,
  output: `// Adding a new formatter or sender requires no changes to ReportService
// — it's open for extension, closed for modification (OCP + DIP).`,
  related: ["interfaces", "dependency-injection", "clean-architecture"],
  prerequisites: ["inheritance","interfaces","dependency-injection"],
  mistakes: [
      "Treating SOLID as rules to follow mechanically rather than heuristics for recognising design problems",
      "Applying Dependency Inversion everywhere immediately \u2014 start concrete, extract interfaces when you have two implementations",
      "Creating interfaces for every class before there's a real need \u2014 YAGNI applies"
  ],
  interviewQ: `Can you explain the Dependency Inversion Principle with a concrete example?`,
  interviewA: `DIP states that high-level modules should not depend on low-level modules — both should depend on abstractions. Example: instead of <code>OrderService</code> creating a <code>SqlOrderRepository</code> directly, it depends on <code>IOrderRepository</code>. The concrete SQL implementation is provided via DI. This means you can swap the repository for an in-memory fake in tests without changing <code>OrderService</code>.`,
  whyItMatters: `The SOLID principles are the most cited design guidelines in object-oriented programming interviews and code reviews. Following them produces code that is easier to test, extend, and reason about — and violating them is the most common cause of codebases that become hard to change over time.`,
  difficulty: 'advanced'
};
