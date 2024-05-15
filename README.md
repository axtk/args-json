# args-json

*Zero-dependency typed command-line argument parser*

## Installation

```
npm i args-json
```

## Usage

```js
import {parseArgs} from 'args-json';
```

### String input

```js
let args = parseArgs('--config ./configs/default.json --debug');
// {config: './configs/default.json', debug: true}

if (args.debug)
    console.log(args.config);
```

The first line is also equivalent to:

```js
let args = parseArgs('--config=./configs/default.json --debug');
```

or

```js
let args = parseArgs('--config="./configs/default.json" --debug');
```

Note that the `config` value is separated from the key either with a space or an equals sign, and the value is either quoted or not. These variants are equivalent.

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
let args = parseArgs(process.argv.slice(2));
```

### Key mapping

```js
let args = parseArgs('-c ./configs/default.json --debug', {c: 'config'});
// {config: './configs/default.json', debug: true}

if (args.debug)
    console.log(args.config);
```

As specified with the second parameter of `parseArgs()`, `-c` is mapped to `config` in the output.

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
