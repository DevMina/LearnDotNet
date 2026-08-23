export default {
  versionLabel: "C# 14",
  tagline: "Add logic to one accessor without a manual backing field.",
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
  prerequisites: ["classes-objects"],
  mistakes: [
      "Not reading the compiler warning before suppressing it \u2014 warnings usually point to a real problem",
      "Writing the feature before writing a test \u2014 makes it much harder to test later",
      "Ignoring null return values from framework methods \u2014 check the documentation for when null is valid"
  ],
  difficulty: 'intermediate',
  whyItMatters: `The field keyword eliminates an entire class of property boilerplate. Previously, adding a guard to one accessor (e.g. clamping a value on set) required declaring a separate backing field, writing the full property, and keeping the names in sync. Now it is one line.`,
  interviewQ: `When would you use <code>field</code> instead of a manually declared backing field?`,
  interviewA: `Use <code>field</code> when you want to add logic to only one accessor while keeping the other as the compiler-generated default. For example: <code>public int Age { get; set => field = Math.Max(0, value); }</code> validates on set without a separate <code>_age</code> field. Use a manual backing field when you need to access the raw storage from outside the property (e.g. in a constructor bypass, or when the field is shared across multiple properties).`,
  related: ["classes-objects","init-only-properties","records"]
};
