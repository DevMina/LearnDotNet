export default {
  tagline: "Add logic to one accessor without a manual backing field (C# 14).",
  explanation: `
          <p>The <strong>field</strong> contextual keyword lets you reach the compiler-generated backing field of an auto-property directly inside its accessors. That means you can add validation or normalization to just one accessor without declaring a private backing field and converting the whole thing into a full property.</p>
          <p>If a type already has a member literally named <em>field</em>, you can disambiguate with <em>@field</em> or <em>this.field</em>.</p>
        `,
  keyPoints: [
  "field refers to the compiler-synthesized backing field — no manual field declaration needed",
  "You can add logic to just get or just set, leaving the other as a plain auto-accessor",
  "Use @field or this.field if the type already has a member literally named field"
],
  code: `public class Person
{
    public string Name
    {
        get;
        set => field = value.Trim();
    }
}

var p = new Person { Name = "  Grace  " };
Console.WriteLine($"'{p.Name}'");`,
  output: `'Grace'`,
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ]
};
