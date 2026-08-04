export default {
  tagline: "Skip the boilerplate Main method and class wrapper.",
  explanation: `
          <p><strong>Top-level statements</strong>, introduced in C# 9, let a program's entry point be written directly in a file without an explicit <em>class Program</em> or <em>static void Main</em> — the compiler generates them for you behind the scenes. This is what new console and minimal-API ASP.NET Core projects use by default.</p>
          <p>Only one file per project may contain top-level statements, and command-line arguments are still available through the implicit <em>args</em> variable. It's purely a readability convenience — the compiled output is identical to the traditional form.</p>
        `,
  keyPoints: [
  "The compiler generates the Main method and Program class implicitly",
  "Only one file in a project can use top-level statements",
  "args and async Main (via top-level await) both still work as expected"
],
  code: `Console.WriteLine("Starting up...");

var total = Sum(1, 2, 3);
Console.WriteLine($"Total: {total}");

static int Sum(params int[] nums) => nums.Sum();`,
  output: `Starting up...
Total: 6`,
  related: ["file-scoped-namespaces"]
};
