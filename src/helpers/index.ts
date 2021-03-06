import { HostConfig } from './../types'
import { UserEntity } from './../modules/users/user.entity'
import { version as uuidVersion, validate as uuidValidate, v4 as uuid } from 'uuid'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)
/**
 * generate uuid ver 4
 * @param {string} string
 * @returns {string} string
 */
export const uuidV4: string = uuid()

/**
 * validate uuid is ver 4 and is valid
 * @param {string} uuid string
 * @returns {boolean} bolean
 */
export const uuidValidateV4 = (uuid: string) => uuidValidate(uuid) && uuidVersion(uuid) === 4

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string} hashed password
 */
export const generateHash = async (stringValue: string) => {
  const salt = randomBytes(8).toString('hex')
  const hash = (await scrypt(stringValue, salt, 32)) as Buffer
  return salt + '.' + hash.toString('hex')
}

/**
 * compare two string and validate if both have the same hash
 * @param {string} string A
 * @param {string} string B
 * @returns {boolean} bolean
 */
export const validateHash = async (aStringValue: string, bStringValue: string) => {
  const [salt, storedHash] = aStringValue.split('.')
  const hash = (await scrypt(bStringValue, salt, 32)) as Buffer
  //console.log('Hash: ', hash.toString('hex'), 'storedHash: ', storedHash)
  return storedHash == hash.toString('hex')
}

export const generateAuthenticationEmail = (user: UserEntity, hostConfig: HostConfig) => {
  const { protocol, host, port } = hostConfig
  return {
    from: `Company name <developipetesting@gmail.com>`,
    to: user.email, // list of receivers (separated by ,)
    subject: 'Testing Nodemailer',
    text: 'Verify Email',
    html: `Hi! <br><br> Thanks for your registration<br><br>
    <a href="${protocol}://${host}:${port}/auth/email/verify/${user.emailUuid}">Click here to activate your account</a>`,
  }
}

export const isNullOrUndefined = <T>(object: T | undefined | null): object is T => {
  return <T>object !== undefined && <T>object !== null
}

export const isNil = (value: any): null | undefined => {
  if (value === null || value === undefined) return value
}
