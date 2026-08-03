export default {
  tagline: "Group a few values together without declaring a class.",
  explanation: `
          <p><strong>Value tuples</strong> let you return or group multiple values with named elements without declaring a dedicated type — handy for small, internal groupings that don't warrant a full class or record. The syntax <em>(string Name, int Age)</em> gives each element a readable name instead of relying on <em>.Item1</em>, <em>.Item2</em>.</p>
          <p><strong>Deconstruction</strong> unpacks a tuple — or any type with a matching <em>Deconstruct</em> method, including records — into separate variables in one statement.</p>
        `,
  keyPoints: [
  "(string Name, int Age) syntax gives tuple elements meaningful names",
  "Deconstruction works on tuples, records, and any type with a matching Deconstruct method",
  "Prefer a record over a tuple once the grouping has real behavior or is used widely"
],
  code: `(string Name, int Age) GetPerson() => ("Ada", 29);

var (name, age) = GetPerson();
Console.WriteLine($"{name} is {age}");`,
  output: `Ada is 29`
};
