import { isKey } from "./isKey.ts";

export function getArgValues(argName: string, fallback: string[]): string[];
export function getArgValues(argName: string): string[] | undefined;

export function getArgValues(argName: string, fallback?: string[]) {
  let { argv } = process;
  let k = argv.indexOf(argName);
  let values: string[] = [];

  while (k > 1 && argv[k + 1] && !isKey(argv[k + 1])) values.push(argv[++k]);

  return values.length === 0 ? fallback : values;
}
