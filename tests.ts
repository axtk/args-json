import {parseArgs} from '.';

let k = 0;

function test(actual: unknown, expected: unknown) {
    console.log(`00${++k}`.slice(-3));

    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.log(`Expected: ${JSON.stringify(expected, null, 2)}`);
        console.log(`Actual: ${JSON.stringify(actual, null, 2)}`);

        throw new Error('Unexpected value');
    }
}

test(parseArgs(), {
    test: 1,
});

test(parseArgs('--debug'), {
    debug: true,
});

test(parseArgs('-d', {d: 'debug'}), {
    debug: true,
});

test(parseArgs('-debug'), {
    '': '-debug',
});

test(parseArgs('--debug -v', {v: 'version'}), {
    debug: true,
    version: true,
});

test(parseArgs('--debug -v 1.2.3', {v: 'version'}), {
    debug: true,
    version: '1.2.3',
});

test(parseArgs('--debug -v=1.2.3', {v: 'version'}), {
    debug: true,
    version: '1.2.3',
});

test(parseArgs('--debug --v=1.2.3', {v: 'version'}), {
    debug: true,
    version: '1.2.3',
});

test(parseArgs('--debug --version=1.2.3'), {
    debug: true,
    version: '1.2.3',
});

test(parseArgs('--debug --parsed-args'), {
    'debug': true,
    'parsed-args': true,
});

test(parseArgs('--debug --parsed-args', {'parsed-args': 'parsedArgs'}), {
    debug: true,
    parsedArgs: true,
});

test(parseArgs('--config ./configs/default.json -d'), {
    config: './configs/default.json',
    d: true,
});

test(parseArgs('--config=./configs/default.json -d'), {
    config: './configs/default.json',
    d: true,
});

test(parseArgs('--config="./configs/default.json" -d'), {
    config: './configs/default.json',
    d: true,
});

test(parseArgs('-c ./configs/default.json --ttl=1000 -d'), {
    c: './configs/default.json',
    ttl: 1000,
    d: true,
});

test(parseArgs('-c "./configs/default.json" --ttl=1000 -v=1.0.0', {c: 'config'}), {
    config: './configs/default.json',
    ttl: 1000,
    v: '1.0.0',
});

test(parseArgs('-t "random word" -t test -t 10', {t: 'tags'}), {
    tags: ['random word', 'test', 10],
});

test(parseArgs('-d \'{"data":{"id":3,"tags":["test","random"]}}\' --debug'), {
    d: {
        data: {
            id: 3,
            tags: ['test', 'random'],
        },
    },
    debug: true,
});

let longLine = '-i -n=0 --test qwe -d "lorem ipsum" --config=./config.json -x true --debug';

test(parseArgs(longLine, {d: 'description'}), {
    i: true,
    n: 0,
    test: 'qwe',
    description: 'lorem ipsum',
    config: './config.json',
    x: true,
    debug: true,
});

test(parseArgs('-d \'{"x":10}\' -i 0 -n=3 -c ./config.json'), {
    d: {x: 10},
    i: 0,
    n: 3,
    c: './config.json',
});

type Args = {
    config?: string;
    debug?: boolean;
};

let parsedArgs = parseArgs<Args>(['--config', './configs/default.json', '--debug']);

test(parsedArgs, {
    config: './configs/default.json',
    debug: true,
});

test(parsedArgs.config, './configs/default.json');

console.log('PASSED');
