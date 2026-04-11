export function getDefaultInput(): string[] {
  return typeof process === "undefined" ? [] : process.argv;
}
