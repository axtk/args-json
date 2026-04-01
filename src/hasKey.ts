import { Args } from "./Args.ts";

export function hasKey(x: string) {
  return new Args().hasKey(x);
}
