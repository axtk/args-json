# args-json

Zero-dependency descriptively typed command-line argument parser

Contents: [parseArgs](#parseargs) · [Args](#args) · [isOn / isOff / isExplicitlyOff](#ison--isoff--isexplicitlyoff)

## parseArgs

### String input

```js
import { parseArgs } from "args-json";

let args = parseArgs(
  "--config=./config.json -v 1.5.12 -d \"lorem ipsum\" -i -n=0 --test-value qwe --debug",
  {
    v: "version",
    d: "description",
  }
);
// args = {
//   config: "./config.json",
//   version: "1.5.12",
//   description: "lorem ipsum",
//   i: true,
//   n: 0,
//   testValue: "qwe",
//   debug: true,
// };
```

Note that keys and values can be separated from each other either with a space or an equals sign, and the value can be either quoted or not. These variants are equivalent. Also, keys are converted to *camelCase* (like `--test-value` &rarr; `testValue` in the example above).

The second parameter is optional. It is a way to rename argument keys in the output. In the example above, `-d` and `-v` in the input string are renamed to `description` and `version` in the output object.

Other examples:

```js
let args = parseArgs("--config ./configs/default.json --debug");
// { config: "./configs/default.json", debug: true }

if (args.debug)
  console.log(args.config);
```

The first line is also equivalent to:

```js
let args = parseArgs("--config \"./configs/default.json\" --debug");
```

or

```js
let args = parseArgs("--config=./configs/default.json --debug");
```

or

```js
let args = parseArgs("--config=\"./configs/default.json\" --debug");
```

### String array input

```js
let args = parseArgs(["--config", "./configs/default.json", "--debug"]);
// { config: "./configs/default.json", debug: true }

if (args.debug)
  console.log(args.config);
```

### Node process arguments

In a Node environment, `parseArgs()` without parameters parses the node process arguments.

```js
let args = parseArgs();
```

is equivalent to

```js
let args = parseArgs(process.argv);
```

### Key mapping

```js
let args = parseArgs("-c ./configs/default.json --debug", { c: "config" });
// { config: "./configs/default.json", debug: true }

if (args.debug)
  console.log(args.config);
```

As specified with the second parameter of `parseArgs()`, `-c` is mapped to `config` in the output.

### Value parsing

Values are `JSON.parse`d if they are parsable.

```js
let args = parseArgs("-d \"{\"x\":10}\" -i 0 -n=3 -c ./config.json");
// { d: { x: 10 }, i: 0, n: 3, c: "./config.json" }
```

### Unkeyed values

Values that aren't preceded by a dashed key (like `-x` or `--xxx`) are collected in an array under an empty key entry.

```js
let args = parseArgs("unkeyed args --debug -x 0 -y 1");
// { "": ["unkeyed", "args"], debug: true, x: 0, y: 1 }
```

### Descriptive typing

The output type can be descriptively specified, without validation, by providing a generic type to `parseArgs<T>()`.

```ts
type CustomShape = {
  level?: number;
  debug?: boolean;
};

let args = parseArgs<CustomShape>("--level=0 --debug");

if (args.debug) console.log(`Level: ${args.level}`);
```

## Args

Use an `Args` class instance to facilitate access to named command line arguments:

```js
import { Args } from "args-json";

let args = new Args(["--key", "value", "--paths", "./x", "./y"]);

args.hasKey("--key") // true
args.hasKey("--arg") // false
args.getValue("--key") // "value"
args.getValues("--paths") // ["./x", "./y"]
```

Without an argument array, `new Args()` is equivalent to `new Args(process.argv.slice(2))`. An `Args` object initialized without arguments can also be directly imported with `import { args } from "args-json";`.

## isOn / isOff / isExplicitlyOff

Use `isOn(x)` and `isOff(x)` to check whether a parameter value is `true`, `1`, `"on"` or `false`, `0`, `"off"`, `null`, `undefined`.

```ts
import { parseArgs, isOn, isOff } from "args-json";

// isOn
isOn(parseArgs("--debug").debug) // true
isOn(parseArgs("--debug=1").debug) // true
isOn(parseArgs("--debug=on").debug) // true

isOn(parseArgs("").debug) // false
isOn(parseArgs("--debug=0").debug) // false
isOn(parseArgs("--debug=off").debug) // false

new Args(["--debug"]).isOn("--debug") // true
new Args(["--debug", "1"]).isOn("--debug") // true
new Args(["--debug", "on"]).isOn("--debug") // true

// isOff
isOff(parseArgs("").debug) // true
isOff(parseArgs("--debug=0").debug) // true
isOff(parseArgs("--debug=off").debug) // true

new Args([""]).isOff("--debug") // true
new Args(["--debug", "0"]).isOff("--debug") // true
new Args(["--debug", "off"]).isOff("--debug") // true
```

Note the difference between `isOff(x)` and `isExplicitlyOff(x)`: `isExplicitlyOff(x)` results in `true` if `x` is present and it's explicitly a turn-off value, while `isOff(x)` returns `true` if `x` is omitted, too.

```ts
import { parseArgs, isOff, isExplicitlyOff } from "args-json";

isOff(parseArgs("--debug=off").debug) // true
isOff(parseArgs("--debug=0").debug) // true
isOff(parseArgs("").debug) // true

isExplicitlyOff(parseArgs("--debug=off").debug) // true
isExplicitlyOff(parseArgs("--debug=0").debug) // true
isExplicitlyOff(parseArgs("").debug) // false
```

Use the utility types `On` and `Off` (or `ExplicitlyOff`) to define a switch parameter type:

```ts
import { parseArgs, type On, type Off } from "args-json";

type Params = {
  debug?: On | Off;
};

let args = parseArgs<Params>("--debug=on");
```
