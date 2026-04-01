import { args } from "./const/args.ts";

export function getValue(key: string | string[], fallback: string): string;
export function getValue(key: string | string[]): string | undefined;

export function getValue(key: string | string[], fallback?: string) {
  if (fallback === undefined) return args.getValue(key);

  return args.getValue(key, fallback);
}
