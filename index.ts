export type ArgMap = Record<string, string>;

function toKey(x: string | undefined): string | undefined {
    if (x) {
        if (x.startsWith('--') && x.length > 2)
            return x.slice(2);
        if (x.startsWith('-') && x.length === 2)
            return x.slice(1);
    }
}

function split(x: string): string[] {
    let words: string[] = [], word = '';

    let hasOpenSingleQuote = false;
    let hasOpenDoubleQuote = false;

    for (let i = 0; i < x.length; i++) {
        let c = x[i];

        if (/^\s/.test(c) && !hasOpenSingleQuote && !hasOpenDoubleQuote) {
            if (word) words.push(word);
            word = '';
            continue;
        }

        if (c === '\'' && x[i - 1] !== '\\')
            hasOpenSingleQuote = !hasOpenSingleQuote;

        if (c === '"' && x[i - 1] !== '\\')
            hasOpenDoubleQuote = !hasOpenDoubleQuote;

        word += c;
    }

    if (word)
        words.push(word);

    return words;
}

export function parseArgs<T extends Record<string, unknown> = Record<string, unknown>>(
    map?: ArgMap,
): T;

export function parseArgs<T extends Record<string, unknown> = Record<string, unknown>>(
    input?: string | string[],
    map?: ArgMap,
): T;

export function parseArgs<T extends Record<string, unknown> = Record<string, unknown>>(
    input?: string | string[] | ArgMap,
    map?: ArgMap,
): T {
    let normalizedInput: string[];
    let normalizedMap: ArgMap | undefined;

    if (input === undefined)
        // eslint-disable-next-line no-constant-binary-expression -- for non-node environments
        normalizedInput = typeof process === undefined ? [] : process.argv.slice(2);
    else if (typeof input === 'string')
        normalizedInput = split(input);
    else if (Array.isArray(input))
        normalizedInput = input.map(x => String(x));
    else if (input !== null && typeof input === 'object') {
        normalizedInput = process.argv.slice(2);
        normalizedMap = input;
    }
    else normalizedInput = [];

    normalizedInput = normalizedInput
        .map(item => {
            let normalizedItem = item.trim();
            let k = normalizedItem.indexOf('=');

            if (k === -1)
                return normalizedItem;

            return [
                normalizedItem.slice(0, k),
                normalizedItem.slice(k + 1),
            ];
        })
        .flat();

    if (map)
        normalizedMap = map;

    let key = '';
    let parsedArgs: Record<string, unknown> = {};

    for (let rawValue of normalizedInput) {
        rawValue = rawValue.trim();

        if (rawValue.startsWith('"') && rawValue.endsWith('"'))
            rawValue = rawValue.slice(1, -1);
        else if (rawValue.startsWith('\'') && rawValue.endsWith('\''))
            rawValue = rawValue.slice(1, -1);

        let parsedKey = toKey(rawValue);

        if (parsedKey !== undefined) {
            let nextKey = normalizedMap?.[parsedKey] ?? parsedKey;

            if (key && nextKey !== key && parsedArgs[key] === undefined)
                parsedArgs[key] = true;

            key = nextKey;
            continue;
        }

        let parsedValue;

        if (rawValue) {
            try {
                parsedValue = JSON.parse(rawValue);
            }
            catch {
                parsedValue = rawValue;
            }
        }
        else parsedValue = true;

        let prevValue = parsedArgs[key];
        let value;

        if (prevValue === undefined)
            value = parsedValue;
        else if (Array.isArray(prevValue))
            value = [...prevValue, parsedValue];
        else
            value = [prevValue, parsedValue];

        parsedArgs[key] = value;
    }

    if (key && parsedArgs[key] === undefined)
        parsedArgs[key] = true;

    return parsedArgs as T;
}
