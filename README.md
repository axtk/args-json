# args-json

*Zero-dependency typed command-line argument parser*

## Installation

```
npm i args-json
```

## Usage

```js
import {parseArgs} from 'args-json';

let args = parseArgs('-i -n=0 --test qwe -d "lorem ipsum" --config=./config.json -x true --debug', {
    d: 'description',
});
// args = {
//     i: true,
//     n: 0,
//     test: 'qwe',
//     description: 'lorem ipsum',
//     config: './config.json',
//     x: true,
//     debug: true,
// };
```

Note that keys and values can be separated from each other either with a space or an equals sign, and the value can be either quoted or not. These variants are equivalent.

The second parameter is optional. It is a way to rename argument keys in the output. In the example above, `-d` in the input string is renamed to `description` in the output object.

### String input

```js
let args = parseArgs('--config ./configs/default.json --debug');
// {config: './configs/default.json', debug: true}

if (args.debug)
    console.log(args.config);
```

The first line is also equivalent to:

```js
let args = parseArgs('--config "./configs/default.json" --debug');
```

or

```js
let args = parseArgs('--config=./configs/default.json --debug');
```

or

```js
let args = parseArgs('--config="./configs/default.json" --debug');
```

### String array input

```js
let args = parseArgs(['--config', './configs/default.json', '--debug']);
// {config: './configs/default.json', debug: true}

if (args.debug)
    console.log(args.config);
```

### Node process arguments

In a Node environment, `parseArgs()` without parameters parses the node process arguments.

```js
let args = parseArgs();
```

which is equivalent to

```js
let args = parseArgs(process.argv);
```

### Key mapping

```js
let args = parseArgs('-c ./configs/default.json --debug', {c: 'config'});
// {config: './configs/default.json', debug: true}

if (args.debug)
    console.log(args.config);
```

As specified with the second parameter of `parseArgs()`, `-c` is mapped to `config` in the output.

### Value parsing

Values are `JSON.parse`d if they are parsable.

```js
let args = parseArgs('-d \'{"x":10}\' -i 0 -n=3 -c ./config.json');
// {d: {x: 10}, i: 0, n: 3, c: './config.json'}
```

### Typing

The output type can be specified by providing a generic type to `parseArgs<T>()`.

```ts
type CustomShape = {
    level?: number;
    debug?: boolean;
};

let args = parseArgs<CustomShape>('--level=0 --debug');

if (args.debug)
    console.log(`Level: ${args.level}`);
```
