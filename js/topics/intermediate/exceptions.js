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
Cleanup ran`
};
