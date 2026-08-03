// Minimal C# syntax highlighter — regex-based, no external dependencies.
// Returns HTML string with <span> tags for keywords, strings, comments, types, numbers, method calls.

const CSHARP_KEYWORDS = [
  'abstract','as','async','await','base','bool','break','byte','case','catch','char',
  'checked','class','const','continue','decimal','default','delegate','do','double',
  'else','enum','event','explicit','extern','false','finally','fixed','float','for',
  'foreach','get','goto','if','implicit','in','int','interface','internal','is','lock',
  'long','namespace','new','null','object','operator','out','override','params',
  'private','protected','public','readonly','record','ref','return','sbyte','sealed',
  'set','short','sizeof','stackalloc','static','string','struct','switch','this','throw',
  'true','try','typeof','uint','ulong','unchecked','unsafe','ushort','using','var',
  'virtual','void','volatile','while','yield','init','required','partial','nameof','with'
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function highlightCSharp(code) {
  const lines = code.split('\n');
  const out = lines.map(line => highlightLine(line));
  return out.join('\n');
}

function highlightLine(line) {
  // Tokenize preserving order: comments, strings, then words/numbers.
  const tokens = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    // Line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'c', text: line.slice(i) });
      i = n;
      break;
    }
    // String (basic + interpolated $"...")
    if (line[i] === '"' || (line[i] === '$' && line[i + 1] === '"')) {
      let start = i;
      i += (line[i] === '$') ? 2 : 1;
      while (i < n && line[i] !== '"') {
        if (line[i] === '\\') i++;
        i++;
      }
      i++; // closing quote
      tokens.push({ type: 's', text: line.slice(start, i) });
      continue;
    }
    // Char literal
    if (line[i] === "'" ) {
      let start = i;
      i++;
      while (i < n && line[i] !== "'") { if (line[i] === '\\') i++; i++; }
      i++;
      tokens.push({ type: 's', text: line.slice(start, i) });
      continue;
    }
    // Word (identifier / keyword)
    if (/[A-Za-z_]/.test(line[i])) {
      let start = i;
      while (i < n && /[A-Za-z0-9_]/.test(line[i])) i++;
      const word = line.slice(start, i);
      // Method call? word followed by '('
      let j = i;
      while (j < n && line[j] === ' ') j++;
      const isCall = line[j] === '(';
      const isType = /^[A-Z]/.test(word) && !CSHARP_KEYWORDS.includes(word);

      if (CSHARP_KEYWORDS.includes(word)) {
        tokens.push({ type: 'k', text: word });
      } else if (isType) {
        tokens.push({ type: 'ty', text: word });
      } else if (isCall) {
        tokens.push({ type: 'm', text: word });
      } else {
        tokens.push({ type: 'plain', text: word });
      }
      continue;
    }
    // Number
    if (/[0-9]/.test(line[i])) {
      let start = i;
      while (i < n && /[0-9.fFmMdDlLuU]/.test(line[i])) i++;
      tokens.push({ type: 'n', text: line.slice(start, i) });
      continue;
    }
    // Everything else (punctuation, whitespace)
    let start = i;
    i++;
    tokens.push({ type: 'plain', text: line.slice(start, i) });
  }

  return tokens.map(t => {
    const escaped = escapeHtml(t.text);
    if (t.type === 'plain') return escaped;
    return `<span class="${t.type}">${escaped}</span>`;
  }).join('');
}
