import { version as uuidVersion, validate as uuidValidate, v4 as uuid } from 'uuid'

export const uuidV4 = uuid()

export const uuidValidateV4 = (uuid) => uuidValidate(uuid) && uuidVersion(uuid) === 4
