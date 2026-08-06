export default {
  tagline: "One namespace per file, without an extra indentation level (C# 10).",
  explanation: `
          <p>A <strong>file-scoped namespace</strong> declaration (<em>namespace MyApp.Models;</em>) applies to the entire file without needing braces or an extra indent level for every type inside it. Since most files only declare one namespace anyway, this removes a layer of purely cosmetic nesting from nearly every C# file in a typical project.</p>
          <p>It behaves identically to the traditional braced form — this is a formatting improvement, not a new capability.</p>
        `,
  keyPoints: [
  "namespace Foo; (with a semicolon, no braces) applies to the whole file",
  "Only one file-scoped namespace is allowed per file",
  "Purely a formatting improvement — behaves identically to the braced form"
],
  code: `// Models/Package.cs
namespace ShippingApp.Models;

public class Package
{
    public string TrackingNumber { get; init; } = "";
}

// Program.cs
using ShippingApp.Models;

var package = new Package { TrackingNumber = "1Z999AA1" };
Console.WriteLine(package.TrackingNumber);`,
  output: `1Z999AA1`,
  related: ["top-level-statements"],
  mistakes: [
      "Mixing file-scoped and block-scoped namespaces in the same project \u2014 pick one style and stick to it",
      "Using file-scoped namespaces in a file with multiple namespaces \u2014 not allowed; one namespace per file",
      "Forgetting the semicolon after the namespace declaration \u2014 it's a statement, not a block"
  ]
};
