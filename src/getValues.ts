import { isKey } from "./isKey.ts";

export function getValues(key: string, fallback: string[]): string[];
export function getValues(key: string): string[] | undefined;

export function getValues(key: string, fallback?: string[]) {
  let { argv } = process;
  let k = argv.indexOf(key);
  let values: string[] = [];

  while (k > 1 && argv[k + 1] && !isKey(argv[k + 1])) values.push(argv[++k]);

  return values.length === 0 ? fallback : values;
}
