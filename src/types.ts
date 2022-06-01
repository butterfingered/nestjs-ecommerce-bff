/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (...arguments_: Arguments) => T

export type AuthConfig = {
  privateKey: string
  publicKey: string
  jwtExpirationTime: number
}

export type ApiResponse = {
  statusCode: number
  message: string
  date: string
  host: string
  path: string
}

export type HostConfig = {
  protocol: string
  host: string
  port: number
}

export type NodeMailConfig = {
  port: number
  secure: boolean
  tls: {
    rejectUnauthorized: boolean
  }
  host: string
  auth: {
    user: string
    pass: string //you must use app password from may-30-2022
  }
}

export type Optional<T> = T | undefined

export interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  // eslint-disable-next-line prettier/prettier
  new (...args: any[]): { }
}
