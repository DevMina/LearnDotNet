export default {
  versionLabel: "C# 9",
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
  related: ["file-scoped-namespaces"],
  mistakes: [
      "Thinking top-level statements remove all structure \u2014 there's still an implicit Program class and Main method",
      "Mixing top-level statements with an explicit Main \u2014 only one file per project can have top-level statements",
      "Putting too much code in Program.cs \u2014 top-level statements are for startup, not business logic"
  ],
  difficulty: 'beginner',
  whyItMatters: `Top-level statements eliminate the ceremony of namespace, class, and Main method from small programs and scripts. They make C# approachable for newcomers and suitable for scripting scenarios, while remaining fully compatible with the full language.`,
  prerequisites: ["variables-types","methods-parameters"],
  interviewQ: `Can a project have top-level statements in more than one file?`,
  interviewA: `No — top-level statements are only allowed in exactly one file per compilation. The compiler generates a hidden <code>Program</code> class with a <code>Main</code> method from that file's top-level statements. If a second file has top-level statements, the compiler emits an error. This is intentional: the entry point of a program should be in one place. All other files must use the standard type/member declaration syntax even if the entry point file uses top-level statements.`
};
