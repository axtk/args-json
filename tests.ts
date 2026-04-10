// Run: `node tests.ts --test=1`
import { Args, isExplicitlyOff, isOff, isOn, type Off, type On, parseArgs } from "./index.ts";

let k = 0;

function test(actual: unknown, expected: unknown) {
  let n = `00${++k}`.slice(-3);

  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.log(n);
    console.log(`Expected: ${JSON.stringify(expected, null, 2)}`);
    console.log(`Actual: ${JSON.stringify(actual, null, 2)}`);

    throw new Error("Unexpected value");
  }

  console.log(`${n} Passed`);
}

function trim(args: Record<string, unknown>) {
  let { "": _unkeyedArgs, ...keyedArgs } = args;

  return keyedArgs;
}

test(trim(parseArgs()), {
  test: 1,
});

test(trim(parseArgs({ test: "lorem" })), {
  lorem: 1,
});

test(trim(parseArgs(process.argv)), {
  test: 1,
});

test(trim(parseArgs(process.argv, { test: "ipsum" })), {
  ipsum: 1,
});

test(parseArgs(""), {});

test(parseArgs("--debug"), {
  debug: true,
});

test(parseArgs("-d", { d: "debug" }), {
  debug: true,
});

test(parseArgs("-debug"), {
  "": ["-debug"],
});

test(parseArgs("test plain args"), {
  "": ["test", "plain", "args"],
});

test(parseArgs("unkeyed args --debug -x 0 -y 1"), {
  "": ["unkeyed", "args"],
  debug: true,
  x: 0,
  y: 1,
});

test(parseArgs("--debug -v", { v: "version" }), {
  debug: true,
  version: true,
});

test(parseArgs("--debug -v 1.2.3", { v: "version" }), {
  debug: true,
  version: "1.2.3",
});

test(parseArgs("--debug -v=1.2.3", { v: "version" }), {
  debug: true,
  version: "1.2.3",
});

test(parseArgs("--debug --v=1.2.3", { v: "version" }), {
  debug: true,
  version: "1.2.3",
});

test(parseArgs("--debug --version=1.2.3"), {
  debug: true,
  version: "1.2.3",
});

test(parseArgs("--debug --parsed-args"), {
  debug: true,
  parsedArgs: true,
});

test(parseArgs("--config ./configs/default.json -d"), {
  config: "./configs/default.json",
  d: true,
});

test(parseArgs('--config "./configs/default.json" -d'), {
  config: "./configs/default.json",
  d: true,
});

test(parseArgs("--config=./configs/default.json -d"), {
  config: "./configs/default.json",
  d: true,
});

test(parseArgs('--config="./configs/default.json" -d'), {
  config: "./configs/default.json",
  d: true,
});

test(parseArgs("-c ./configs/default.json --ttl=1000 -d"), {
  c: "./configs/default.json",
  ttl: 1000,
  d: true,
});

test(
  parseArgs('-c "./config.json" --ttl=1000 -v=1.0.0', {
    c: "config",
    v: "version",
  }),
  {
    config: "./config.json",
    ttl: 1000,
    version: "1.0.0",
  },
);

test(parseArgs('-t "random word" -t test -t 10', { t: "tags" }), {
  tags: ["random word", "test", 10],
});

test(parseArgs('--content "<a href="/">Home</a>"'), {
  content: '<a href="/">Home</a>',
});

test(parseArgs('-d \'{"data":{"id":3,"tags":["test","random"]}}\' --debug'), {
  d: {
    data: {
      id: 3,
      tags: ["test", "random"],
    },
  },
  debug: true,
});

let longLine =
  '-i -n=0 --test qwe -d "lorem ipsum" --config=./config.json -x true --debug';

test(parseArgs(longLine, { d: "description" }), {
  i: true,
  n: 0,
  test: "qwe",
  description: "lorem ipsum",
  config: "./config.json",
  x: true,
  debug: true,
});

test(parseArgs("-d '{\"x\":10}' -i 0 -n=3 -c ./config.json"), {
  d: { x: 10 },
  i: 0,
  n: 3,
  c: "./config.json",
});

type Params1 = {
  config?: string;
  debug?: boolean;
};

let parsedArgs = parseArgs<Params1>([
  "--config",
  "./configs/default.json",
  "--debug",
]);

test(parsedArgs, {
  config: "./configs/default.json",
  debug: true,
});

test(parsedArgs.config, "./configs/default.json");

console.log("\nArgs");

test(new Args(["--test", "x"]).getValue("--test"), "x");
test(new Args(["--test=x"]).getValue("--test"), "x");
test(new Args(["--test", "x"])._input, ["--test", "x"]);
test(new Args(["--test=x"])._input, ["--test", "x"]);
test(new Args(["--test", "x=y"])._input, ["--test", "x=y"]);
test(new Args(["x=y"])._input, ["x=y"]);

type Params2 = {
  debug?: On | Off;
};

console.log("\nisOn");

test(isOn(parseArgs<Params2>("--debug").debug), true);
test(isOn(parseArgs<Params2>("--debug=1").debug), true);
test(isOn(parseArgs<Params2>("--debug=on").debug), true);

test(isOn(parseArgs<Params2>("").debug), false);
test(isOn(parseArgs<Params2>("--debug=0").debug), false);
test(isOn(parseArgs<Params2>("--debug=off").debug), false);

test(new Args(["--debug"]).isOn("--debug"), true);
test(new Args(["--debug", "--test"]).isOn("--debug"), true);
test(new Args(["--debug", "1"]).isOn("--debug"), true);
test(new Args(["--debug", "on"]).isOn("--debug"), true);
test(new Args(["--debug=1"]).isOn("--debug"), true);
test(new Args(["--debug=on"]).isOn("--debug"), true);

test(new Args([""]).isOn("--debug"), false);
test(new Args(["--debug", "0"]).isOn("--debug"), false);
test(new Args(["--debug", "off"]).isOn("--debug"), false);
test(new Args(["--debug=0"]).isOn("--debug"), false);
test(new Args(["--debug=off"]).isOn("--debug"), false);

console.log("\nisOff");

test(isOff(parseArgs<Params2>("").debug), true);
test(isOff(parseArgs<Params2>("--debug=0").debug), true);
test(isOff(parseArgs<Params2>("--debug=off").debug), true);

test(new Args([""]).isOff("--debug"), true);
test(new Args(["--debug", "--test"]).isOff("--debug"), false);
test(new Args(["--debug", "0"]).isOff("--debug"), true);
test(new Args(["--debug", "off"]).isOff("--debug"), true);
test(new Args(["--debug=0"]).isOff("--debug"), true);
test(new Args(["--debug=off"]).isOff("--debug"), true);

console.log("\nisExplicitlyOff");

test(isExplicitlyOff(parseArgs<Params2>("").debug), false);
test(isExplicitlyOff(parseArgs<Params2>("--debug=0").debug), true);
test(isExplicitlyOff(parseArgs<Params2>("--debug=off").debug), true);

test(new Args([""]).isExplicitlyOff("--debug"), false);
test(new Args(["--debug", "--test"]).isExplicitlyOff("--debug"), false);
test(new Args(["--debug", "0"]).isExplicitlyOff("--debug"), true);
test(new Args(["--debug", "off"]).isExplicitlyOff("--debug"), true);
test(new Args(["--debug=0"]).isExplicitlyOff("--debug"), true);
test(new Args(["--debug=off"]).isExplicitlyOff("--debug"), true);

console.log("\nPassed");
