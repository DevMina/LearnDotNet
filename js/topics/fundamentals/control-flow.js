export default {
  tagline: "if/else, switch statements, and switch expressions.",
  explanation: `
          <p>Beyond the familiar <strong>if / else if / else</strong>, modern C# has a <strong>switch expression</strong> — a compact, value-producing alternative to the older switch statement. It uses pattern matching, so you can match on types, ranges, and shapes, not just constant values.</p>
          <p>Switch expressions must be exhaustive or include a discard pattern (<em>_</em>) as a catch-all, which the compiler will warn you about if missing.</p>
        `,
  keyPoints: [
  "Switch expressions return a value using =>",
  "The _ pattern acts as the default/catch-all case",
  "Pattern matching can test types and value ranges, not just equality"
],
  code: `int score = 82;

string grade = score switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    _     => "F"
};

Console.WriteLine($"Grade: {grade}");`,
  output: `Grade: B`
};
