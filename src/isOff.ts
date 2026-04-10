import type { Off } from "./types/Off.ts";

const offValues = new Set(["0", "false", "null", "undefined", "off"]);

export function isOff(x: unknown): x is Off {
  return offValues.has(String(x));
}
