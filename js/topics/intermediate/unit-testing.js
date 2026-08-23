export default {
  tagline: "Verify each unit of logic in isolation, fast and repeatably.",
  explanation: `
          <p><strong>Unit tests</strong> verify a single class or method in isolation — no database, no HTTP, no file system. The most popular framework in .NET is <strong>xUnit</strong>, which discovers tests by convention: any <em>public</em> class with a <em>[Fact]</em> (single case) or <em>[Theory]</em> (multiple inputs via <em>[InlineData]</em>) method is a test. Assertions use <em>Assert.Equal</em>, <em>Assert.True</em>, <em>Assert.Throws</em>, etc.</p>
          <p>Isolating dependencies is done with <strong>mocks</strong> — test doubles that fake external behaviour. The <em>Moq</em> library is the standard choice: <em>new Mock&lt;IMyService&gt;()</em> creates a mock, <em>.Setup(...).Returns(...)</em> configures it, and <em>.Verify(...)</em> asserts it was called. The Arrange-Act-Assert pattern keeps tests readable: set up, run, check.</p>
        `,
  keyPoints: [
    "[Fact] marks a single test; [Theory] with [InlineData] runs it with multiple inputs",
    "Mock dependencies with Moq so tests don't touch real databases or external services",
    "Arrange–Act–Assert: set up state, call the code, assert the outcome"
  ],
  code: `// xUnit + Moq
public class OrderServiceTests
{
    [Fact]
    public void TotalPrice_ReturnsCorrectSum()
    {
        var service = new OrderService();
        var items = new[] { new Item(10m), new Item(25m) };

        var total = service.TotalPrice(items);

        Assert.Equal(35m, total);
    }

    [Theory]
    [InlineData(1, true)]
    [InlineData(0, false)]
    public void IsValid_ChecksQuantity(int qty, bool expected)
    {
        Assert.Equal(expected, new Order(qty).IsValid);
    }
}`,
  output: `Test run for OrderServiceTests
Passed: TotalPrice_ReturnsCorrectSum
Passed: IsValid_ChecksQuantity (qty=1)
Passed: IsValid_ChecksQuantity (qty=0)`,
  related: ["dependency-injection", "interfaces", "exceptions"],
  mistakes: [
      "Testing implementation details instead of behaviour \u2014 tests break on refactoring even when behaviour is unchanged",
      "Making tests depend on each other or on shared mutable state \u2014 tests should be fully independent",
      "Not testing edge cases: empty collections, null inputs, boundary values"
  ],

  difficulty: 'intermediate',

  interviewQ: `What is the difference between a unit test, an integration test, and an end-to-end test?`,

  interviewA: `A unit test isolates a single class or function in memory — no database, no file system, no network. It runs in milliseconds and is the cheapest to write and maintain. An integration test verifies that two or more components work together — e.g. a service class talking to a real (or test) database. An end-to-end test drives the full system via its public interface (HTTP, UI) and is the most expensive and slowest. The test pyramid says to have many unit tests, fewer integration tests, and very few end-to-end tests.`,

  whyItMatters: `Unit tests are the safety net that makes refactoring possible without fear. A comprehensive test suite lets you change internals confidently, catch regressions immediately, and document expected behaviour as executable specifications.`,

  prerequisites: ["classes-objects","interfaces","dependency-injection"],
};
