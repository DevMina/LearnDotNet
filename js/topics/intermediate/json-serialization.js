export default {
  tagline: "Convert objects to JSON and back with System.Text.Json.",
  explanation: `
          <p><strong>System.Text.Json</strong> is the built-in serializer for converting .NET objects to and from JSON, replacing the older third-party Newtonsoft.Json for most scenarios. <em>JsonSerializer.Serialize</em> and <em>Deserialize</em> handle the conversion, and attributes like <em>[JsonPropertyName]</em> or options like <em>PropertyNamingPolicy</em> control the shape of the JSON.</p>
          <p>For high-performance or trimmed/AOT scenarios, <strong>source-generated serialization</strong> (a <em>JsonSerializerContext</em>) avoids reflection entirely by generating the (de)serialization code at build time.</p>
        `,
  keyPoints: [
  "JsonSerializer.Serialize/Deserialize are the core built-in APIs",
  "JsonSerializerOptions controls casing, indentation, and null handling",
  "Source-generated contexts avoid reflection for better startup/AOT performance"
],
  code: `using System.Text.Json;

public record Person(string Name, int Age);

var person = new Person("Mina", 29);
string json = JsonSerializer.Serialize(person);
Console.WriteLine(json);

var back = JsonSerializer.Deserialize<Person>(json);
Console.WriteLine(back);`,
  output: `{"Name":"Mina","Age":29}
Person { Name = Mina, Age = 29 }`,
  related: ["records", "attributes"],
  mistakes: [
      "Deserialising into a type with no public setters \u2014 the properties stay at their default values silently",
      "Forgetting that System.Text.Json is case-sensitive by default \u2014 JSON keys must match property names exactly",
      "Using JsonSerializer in a hot path without source generation \u2014 reflection-based serialisation has significant overhead"
  ]
};
