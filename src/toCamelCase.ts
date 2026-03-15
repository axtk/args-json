export function toCamelCase(x: string): string {
  let s = x.replace(/^[-_.\s~+]|[-_.\s~+]$/g, "");

  if (!/[-_.\s~+]/.test(s)) return s.slice(0, 1).toLowerCase() + s.slice(1);

  return s
    .toLowerCase()
    .replace(/[-_.\s~+](\S)/g, (_, match) => match.toUpperCase());
}
