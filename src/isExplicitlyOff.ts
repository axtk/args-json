import { isOff } from "./isOff.ts";
import type { ExplicitlyOff } from "./types/ExplicitlyOff.ts";

export function isExplicitlyOff(x: unknown): x is ExplicitlyOff {
  return isOff(x) && String(x) !== "undefined";
}
