export default {
  tagline: "try/catch/finally and when to throw.",
  explanation: `
          <p>C# uses exceptions for error conditions that are exceptional, not for routine control flow. A <strong>try</strong> block runs code that might fail; matching <strong>catch</strong> blocks handle specific exception types; <strong>finally</strong> always runs, making it the right place for cleanup like closing a file.</p>
          <p>Catch specific exception types before general ones — catching the base <em>Exception</em> type first would swallow everything, hiding bugs you actually want to see.</p>
        `,
  keyPoints: [
  "Catch specific exception types before general ones",
  "finally always runs, whether or not an exception occurred",
  "Prefer exceptions for truly exceptional cases, not expected branching"
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
Cleanup ran`,
  prerequisites: ["classes-objects"],
  mistakes: [
      "Catching Exception (or worse, catching and swallowing it) instead of a specific exception type",
      "Using exceptions for normal control flow \u2014 they're expensive and make code harder to read",
      "Re-throwing with throw ex instead of throw \u2014 throw ex resets the stack trace"
  ],
  interviewQ: `What is the difference between <code>throw</code> and <code>throw ex</code> in a catch block?`,
  interviewA: `<code>throw</code> (no argument) re-throws the caught exception while preserving the original stack trace — you can see exactly where the exception was first thrown. <code>throw ex</code> re-throws the exception but resets the stack trace to the current line, hiding where the error originated. Always prefer bare <code>throw</code> unless you are deliberately wrapping the exception in a new one with <code>throw new WrapperException("...", ex)</code>.`,
  whyItMatters: `Correct exception handling is the difference between a system that fails gracefully with a useful error message and one that corrupts data silently. Understanding the throw semantics prevents common debugging nightmares.`,
  related: ["classes-objects","async-await","idisposable-using","exception-handling"],
  difficulty: 'intermediate'
};
