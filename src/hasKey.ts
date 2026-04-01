import { isKey } from "./isKey.ts";

export function hasKey(x: string) {
  return isKey(x) && process.argv.indexOf(x) > 1;
}
