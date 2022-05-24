/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (...arguments_: Arguments) => T

export type AuthConfig = {
  privateKey: string
  publicKey: string
  jwtExpirationTime: number
}

export type Optional<T> = T | undefined
