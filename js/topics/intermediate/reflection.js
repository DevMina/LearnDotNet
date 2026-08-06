export default {
  tagline: "Inspect and invoke types at runtime, not just compile time.",
  explanation: `
          <p><strong>Reflection</strong> (in the <em>System.Reflection</em> namespace) lets code examine assemblies, types, and members — and invoke methods or set properties — at runtime, even ones it didn't know about at compile time. It's the mechanism behind serializers, dependency injection containers, and ORMs like Entity Framework.</p>
          <p>It's powerful but comes with real costs: it's slower than direct calls, bypasses some compile-time safety, and can complicate trimming/AOT-compiled apps — so it's typically reached for in framework code, not everyday application logic.</p>
        `,
  keyPoints: [
  "typeof(T) or obj.GetType() gets a Type object describing a type's shape",
  "GetProperties/GetMethods enumerate members; Invoke calls them dynamically",
  "Powers frameworks (DI, serializers, ORMs) but is slower than direct calls"
],
  code: `public class Product
{
    public string Name { get; set; } = "Widget";
    public decimal Price { get; set; } = 9.99m;
}

var product = new Product();
Type type = product.GetType();

foreach (var prop in type.GetProperties())
{
    Console.WriteLine($"{prop.Name} = {prop.GetValue(product)}");
}`,
  output: `Name = Widget
Price = 9.99`,
  related: ["attributes", "dependency-injection"],
  mistakes: [
      "Using reflection in performance-sensitive code \u2014 it's orders of magnitude slower than direct calls",
      "Ignoring BindingFlags \u2014 GetMethod without the right flags silently returns null instead of the method",
      "Bypassing access modifiers with reflection in production code \u2014 breaks encapsulation and makes code fragile"
  ]
};
