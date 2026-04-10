import type { On } from "./types/On.ts";

const onValues = new Set(["1", "true", "on"]);

export function isOn(x: unknown): x is On {
  return onValues.has(String(x));
}
