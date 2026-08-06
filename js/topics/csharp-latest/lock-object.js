export default {
  tagline: "A purpose-built Lock type replaces locking on a plain object (C# 13).",
  explanation: `
          <p>C# 13 introduces <strong>System.Threading.Lock</strong>, a dedicated type for mutual exclusion that the <em>lock</em> statement now recognizes specially, generating more efficient code than locking on an ordinary object.</p>
          <p>Existing code that locks on a plain <em>object</em> still compiles and works exactly the same way — this is an opt-in improvement, not a breaking change.</p>
        `,
  keyPoints: [
  "lock (System.Threading.Lock) generates more efficient code than lock (object)",
  "Existing lock (object) code keeps working unchanged",
  "Purely a performance/clarity improvement to an existing, familiar pattern"
],
  code: `var gate = new Lock();
int counter = 0;

void Increment()
{
    lock (gate)
    {
        counter++;
    }
}

Parallel.For(0, 500, _ => Increment());
Console.WriteLine(counter);`,
  output: `500`,
  related: ["semaphore-slim"],
  mistakes: [
      "Using a public or externally-visible object as the lock target \u2014 external code can deadlock your class",
      "Locking on this or the type itself \u2014 same problem as above",
      "Holding a lock while doing I/O or calling unknown code \u2014 causes deadlocks or starvation"
  ]
};
