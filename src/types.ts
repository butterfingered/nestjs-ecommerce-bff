/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (...arguments_: Arguments) => T
