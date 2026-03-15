export function split(x: string): string[] {
  let words: string[] = [],
    word = "";

  let hasOpenSingleQuote = false;
  let hasOpenDoubleQuote = false;

  for (let i = 0; i < x.length; i++) {
    let c = x[i];

    if (/^\s/.test(c) && !hasOpenSingleQuote && !hasOpenDoubleQuote) {
      if (word) words.push(word);
      word = "";
      continue;
    }

    if (c === "'" && x[i - 1] !== "\\")
      hasOpenSingleQuote = !hasOpenSingleQuote;

    if (c === '"' && x[i - 1] !== "\\")
      hasOpenDoubleQuote = !hasOpenDoubleQuote;

    word += c;
  }

  if (word) words.push(word);

  return words;
}
