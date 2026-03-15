import { isKey } from "./isKey.ts";

export function getArgValue(argName: string, fallback: string): string;
export function getArgValue(argName: string): string | undefined;

export function getArgValue(argName: string, fallback?: string) {
  let { argv } = process;
  let k = argv.indexOf(argName);

  return k > 1 && argv[k + 1] && !isKey(argv[k + 1]) ? argv[k + 1] : fallback;
}
