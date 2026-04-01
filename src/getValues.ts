import { args } from "./const/args.ts";

export function getValues(key: string | string[], fallback: string[]): string[];
export function getValues(key: string | string[]): string[] | undefined;

export function getValues(key: string | string[], fallback?: string[]) {
  if (fallback === undefined) return args.getValues(key);

  return args.getValues(key, fallback);
}
