import type { Off } from "./Off.ts";

export type ExplicitlyOff = Exclude<Off, undefined | "undefined">;
