import { isExplicitlyOff } from "./isExplicitlyOff.ts";
import { isKey } from "./isKey.ts";
import { isOff } from "./isOff.ts";
import { isOn } from "./isOn.ts";

export class Args {
  _input: string[];
  constructor(input?: string[]) {
    this._input = (input ?? process.argv.slice(2)).reduce<string[]>(
      (acc, s) => {
        // Split `"--key=value"` into "--key" and "value"
        if (s.startsWith("-") && s.includes("=")) {
          let key = s.slice(0, s.indexOf("="));

          if (isKey(key)) {
            acc.push(key, s.slice(key.length + 1));
            return acc;
          }
        }

        acc.push(s);
        return acc;
      },
      [],
    );
  }
  hasKey(x: string) {
    return isKey(x) && this._input.includes(x);
  }
  isOn(key: string) {
    let args = this._input;
    let k = args.indexOf(key);

    return (
      k !== -1 &&
      (k === args.length - 1 || isKey(args[k + 1]) || isOn(args[k + 1]))
    );
  }
  isOff(key: string) {
    let args = this._input;
    let k = args.indexOf(key);

    return k === -1 || isOff(args[k + 1]);
  }
  isExplicitlyOff(key: string) {
    let args = this._input;
    let k = args.indexOf(key);

    return k !== -1 && isExplicitlyOff(args[k + 1]);
  }
  getValue(key: string | string[], fallback: string): string;
  getValue(key: string | string[]): string | undefined;
  getValue(key: string | string[], fallback?: string) {
    let args = this._input;
    let keys = Array.isArray(key) ? key : [key];

    for (let k of keys) {
      let i = args.indexOf(k);

      if (i !== -1 && args[i + 1] && !isKey(args[i + 1])) return args[i + 1];
    }

    return fallback;
  }
  getValues(key: string | string[], fallback: string[]): string[];
  getValues(key: string | string[]): string[] | undefined;
  getValues(key: string | string[], fallback?: string[]) {
    let args = this._input;
    let keys = Array.isArray(key) ? key : [key];
    let values: string[] = [];

    for (let k of keys) {
      let i = args.indexOf(k);

      while (i !== -1 && args[i + 1] && !isKey(args[i + 1]))
        values.push(args[++i]);
    }

    return values.length === 0 ? fallback : values;
  }
}
