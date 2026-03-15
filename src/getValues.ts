import { isKey } from "./isKey.ts";

export function getValues(key: string | string[], fallback: string[]): string[];
export function getValues(key: string | string[]): string[] | undefined;

export function getValues(key: string | string[], fallback?: string[]) {
  let { argv } = process;
  let keys = Array.isArray(key) ? key : [key];
  let values: string[] = [];

  for (let k of keys) {
    let i = argv.indexOf(k);

    while (i > 1 && argv[i + 1] && !isKey(argv[i + 1])) values.push(argv[++i]);
  }

  return values.length === 0 ? fallback : values;
}
