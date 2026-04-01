import { Args } from "./Args.ts";

export function getValue(key: string | string[], fallback: string): string;
export function getValue(key: string | string[]): string | undefined;

export function getValue(key: string | string[], fallback?: string) {
  let args = new Args();

  if (fallback === undefined) return args.getValue(key);

  return args.getValue(key, fallback);
}
