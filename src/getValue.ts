import { isKey } from "./isKey.ts";

export function getValue(key: string | string[], fallback: string): string;
export function getValue(key: string | string[]): string | undefined;

export function getValue(key: string | string[], fallback?: string) {
  let { argv } = process;
  let keys = Array.isArray(key) ? key : [key];

  for (let k of keys) {
    let i = argv.indexOf(k);

    if (i > 1 && argv[i + 1] && !isKey(argv[i + 1])) return argv[i + 1];
  }

  return fallback;
}
