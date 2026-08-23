export default {
  difficulty: 'advanced',
  versionLabel: 'C# 7.2 / .NET Core',
  tagline: "A stack-only slice over contiguous memory — zero allocation, zero copying.",
  explanation: `
    <p><code>Span&lt;T&gt;</code> is a <strong>ref struct</strong> that represents a contiguous region of arbitrary memory — an array, a stack allocation, or unmanaged memory — without copying it. Because it is a ref struct, it lives only on the stack and cannot be stored in a class field, boxed, or used across <code>await</code> boundaries.</p>
    <p><code>ReadOnlySpan&lt;T&gt;</code> is the read-only counterpart. <code>string</code> exposes an implicit conversion to <code>ReadOnlySpan&lt;char&gt;</code>, which enables zero-allocation string parsing. <code>Memory&lt;T&gt;</code> is the heap-safe sibling that can be stored in fields and used across async boundaries — at the cost of slightly more overhead.</p>
  `,
  keyPoints: [
    'Span<T> is a ref struct — stack-only; cannot be stored in class fields or used across await',
    'ReadOnlySpan<char> enables zero-allocation string slicing: no substring allocation',
    'stackalloc can produce a Span<T> from stack memory — zero heap allocation',
    'Memory<T> and ReadOnlyMemory<T> are the heap-safe, async-compatible alternatives',
    'System.MemoryExtensions provides Span equivalents of common string/array operations',
  ],
  code: `// Slicing an array — no copy
int[] data = { 1, 2, 3, 4, 5, 6, 7, 8 };
Span<int> middle = data.AsSpan(2, 4); // { 3, 4, 5, 6 }
middle[0] = 99;
Console.WriteLine(data[2]); // 99 — original modified

// Zero-allocation string parsing
string csv = "alice,bob,carol";
ReadOnlySpan<char> span = csv;
int comma = span.IndexOf(',');
ReadOnlySpan<char> first = span[..comma]; // "alice" — no allocation
Console.WriteLine(first.ToString());

// stackalloc — no heap allocation at all
Span<byte> buffer = stackalloc byte[64];
buffer[0] = 0xFF;
Console.WriteLine(buffer.Length); // 64

// Memory<T> — heap-safe, works across await
async Task ProcessAsync(Memory<byte> mem) {
    await Task.Delay(1); // await is fine with Memory
    Console.WriteLine(mem.Length);
}`,
  output: `99
alice
64`,
  prerequisites: ['arrays-collections', 'structs', 'memory-management'],
  mistakes: [
    'Trying to store a Span<T> in a class field — compiler error (ref struct restriction)',
    'Using Span<T> across an await boundary — use Memory<T> instead',
    'Creating a Span over a stackalloc and returning it — the stack frame is gone, the memory is invalid',
    'Confusing Span (stack-only) and Memory (heap-safe, async-compatible)',
  ],
  related: ['memory-management', 'performance-tips', 'arrays-collections'],
  interviewQ: 'What is the difference between <code>Span&lt;T&gt;</code> and <code>Memory&lt;T&gt;</code>?',
  interviewA: '<code>Span&lt;T&gt;</code> is a ref struct — it lives on the stack, cannot be stored in class fields, and cannot cross <code>await</code> points. It is the fastest option for synchronous, stack-scoped slicing. <code>Memory&lt;T&gt;</code> is a regular struct — it can be stored in fields, passed across async boundaries, and converted to a <code>Span</code> on demand via <code>.Span</code>. Use <code>Span</code> for synchronous processing loops; use <code>Memory</code> when you need to store or pass a slice across async operations.',
  whyItMatters: 'Span<T> is the foundation of .NET\'s high-performance I/O stack. ASP.NET Core, System.Text.Json, and System.IO.Pipelines all use Span/Memory to process data without intermediate allocations. Understanding them is essential for writing high-throughput code where GC pressure matters.',
};
