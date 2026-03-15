export function isKey(x: string | undefined): x is string {
  return x !== undefined && (
    (x.startsWith("-") && x.length === 2 && x !== "--") ||
    (x.startsWith("--") && x.length > 2)
  );
}
