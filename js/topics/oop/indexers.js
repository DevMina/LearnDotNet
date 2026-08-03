export default {
  tagline: "Let your own type be accessed with [] like an array.",
  explanation: `
          <p>An <strong>indexer</strong> lets instances of your class be accessed with array-like bracket syntax (<em>myObject[key]</em>) instead of a named method like <em>GetItem(key)</em>. It's how types like <em>List&lt;T&gt;</em> and <em>Dictionary&lt;K,V&gt;</em> support the <em>[]</em> syntax you already use every day.</p>
          <p>An indexer is defined with the <strong>this</strong> keyword in place of a method name, and — like a property — can expose both a <em>get</em> and a <em>set</em> accessor.</p>
        `,
  keyPoints: [
  "Defined with the this keyword instead of a method name",
  "Can be overloaded with different parameter types (e.g. int and string)",
  "Supports both get and set, just like a property"
],
  code: `public class WeekSchedule
{
    private readonly string[] _days = new string[7];

    public string this[int dayIndex]
    {
        get => _days[dayIndex];
        set => _days[dayIndex] = value;
    }
}

var schedule = new WeekSchedule();
schedule[0] = "Standup meeting";
Console.WriteLine(schedule[0]);`,
  output: `Standup meeting`
};
