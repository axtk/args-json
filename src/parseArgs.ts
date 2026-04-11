import { getDefaultInput } from "./getDefaultInput.ts";
import { isKey } from "./isKey.ts";
import { split } from "./split.ts";
import { toKey } from "./toKey.ts";

export type ArgMap = Record<string, string>;

export function parseArgs<
  T extends Record<string, unknown> = Record<string, unknown>,
>(map?: ArgMap): T;

export function parseArgs<
  T extends Record<string, unknown> = Record<string, unknown>,
>(input?: string | string[], map?: ArgMap): T;

export function parseArgs<
  T extends Record<string, unknown> = Record<string, unknown>,
>(input?: string | string[] | ArgMap, map?: ArgMap): T {
  let normalizedInput: string[];
  let normalizedMap: ArgMap | undefined;

  if (input === undefined) normalizedInput = getDefaultInput();
  else if (typeof input === "string") normalizedInput = split(input);
  else if (Array.isArray(input)) normalizedInput = input.map((x) => String(x));
  else if (input !== null && typeof input === "object") {
    normalizedInput = getDefaultInput();
    normalizedMap = input;
  } else normalizedInput = [];

  normalizedInput = normalizedInput.flatMap((item) => {
    let normalizedItem = item.trim();
    let k = normalizedItem.indexOf("=");

    if (k === -1) return normalizedItem;

    let key = normalizedItem.slice(0, k);
    let value = normalizedItem.slice(k + 1);

    // Make sure the entire `normalizedItem` isn't a value containing "="
    // that shouldn't be split into a key and a value
    if (!isKey(key)) return normalizedItem;

    return [key, value];
  });

  if (map) normalizedMap = map;

  let key = "";
  let parsedArgs: Record<string, unknown> = {};

  for (let rawValue of normalizedInput) {
    rawValue = rawValue.trim();

    if (rawValue.startsWith('"') && rawValue.endsWith('"'))
      rawValue = rawValue.slice(1, -1);
    else if (rawValue.startsWith("'") && rawValue.endsWith("'"))
      rawValue = rawValue.slice(1, -1);

    let parsedKey = toKey(rawValue);

    if (parsedKey !== undefined) {
      let nextKey = normalizedMap?.[parsedKey] ?? parsedKey;

      if (key && nextKey !== key && parsedArgs[key] === undefined)
        parsedArgs[key] = true;

      key = nextKey;
      continue;
    }

    let parsedValue: unknown;

    if (rawValue) {
      try {
        parsedValue = JSON.parse(rawValue);
      } catch {
        parsedValue = rawValue;
      }
    } else parsedValue = true;

    let prevValue = parsedArgs[key];
    let value: unknown;

    if (prevValue === undefined)
      value = key === "" ? [parsedValue] : parsedValue;
    else if (Array.isArray(prevValue)) value = [...prevValue, parsedValue];
    else value = [prevValue, parsedValue];

    parsedArgs[key] = value;
  }

  if (key && parsedArgs[key] === undefined) parsedArgs[key] = true;

  return parsedArgs as T;
}
