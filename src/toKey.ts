import { isKey } from "./isKey.ts";
import { toCamelCase } from "./toCamelCase.ts";

export function toKey(x: string | undefined): string | undefined {
  if (!isKey(x)) return;
  if (x.startsWith("-") && x.length === 2) return toCamelCase(x.slice(1));
  if (x.startsWith("--") && x.length > 2) return toCamelCase(x.slice(2));
}
