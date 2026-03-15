import { isKey } from "./isKey.ts";

export function getValue(key: string, fallback: string): string;
export function getValue(key: string): string | undefined;

export function getValue(key: string, fallback?: string) {
  let { argv } = process;
  let k = argv.indexOf(key);

  return k > 1 && argv[k + 1] && !isKey(argv[k + 1]) ? argv[k + 1] : fallback;
}
