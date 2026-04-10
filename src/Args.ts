import { isKey } from "./isKey.ts";
import { isOff } from "./isOff.ts";
import { isOn } from "./isOn.ts";

export class Args {
  input: string[];
  constructor(input?: string[]) {
    this.input = input ?? process.argv.slice(2);
  }
  hasKey(x: string) {
    return isKey(x) && this.input.includes(x);
  }
  isOn(key: string) {
    let args = this.input;
    let k = args.indexOf(key);

    return k !== -1 && (k === args.length - 1 || isKey(args[k + 1]) || isOn(args[k + 1]));
  }
  isOff(key: string) {
    let args = this.input;
    let k = args.indexOf(key);

    return k === -1 || isOff(args[k + 1]);
  }
  getValue(key: string | string[], fallback: string): string;
  getValue(key: string | string[]): string | undefined;
  getValue(key: string | string[], fallback?: string) {
    let args = this.input;
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
    let args = this.input;
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
