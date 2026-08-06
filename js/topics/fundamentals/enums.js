export default {
  tagline: "A closed, named set of constant values.",
  explanation: `
          <p>An <strong>enum</strong> defines a type with a fixed set of named values, making code that would otherwise rely on magic numbers or raw strings self-documenting and type-checked by the compiler. Under the hood, an enum is backed by an integer type (<em>int</em> by default).</p>
          <p>Combine values as bit flags with the <strong>[Flags]</strong> attribute when a variable needs to represent more than one option at once, and use <strong>Enum.Parse</strong> to convert a string into an enum value at runtime.</p>
        `,
  keyPoints: [
  "Backed by an integer type by default (int); can be changed, e.g. : byte",
  "[Flags] lets enum values be combined with bitwise OR",
  "Enum.Parse / TryParse convert strings to enum values at runtime"
],
  code: `public enum OrderStatus { Pending, Shipped, Delivered, Cancelled }

OrderStatus status = OrderStatus.Shipped;
Console.WriteLine(status);
Console.WriteLine((int)status);
Console.WriteLine(Enum.Parse<OrderStatus>("Delivered"));`,
  output: `Shipped
1
Delivered`,
  mistakes: [
      "Casting an arbitrary integer to an enum \u2014 use Enum.IsDefined to validate first",
      "Using enums for bit flags without [Flags] and powers of two \u2014 bitwise operations won't work correctly",
      "Comparing enum values with == but forgetting they're integers underneath \u2014 string comparison won't work"
  ]
};
