export function isKey(x: string) {
  return (
    ((x.startsWith("-") && x.length === 2 && x !== "--") ||
      (x.startsWith("--") && x.length > 2))
  );
}
