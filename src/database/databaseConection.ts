// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoUnit = require('mongo-unit')

export const startMongoInMemory = async () => {
  const url = await mongoUnit.start({ binary: { version: 'v3.7.3' } })
  console.log('fake mongo is started: ', url)
  process.env.DATABASE_URL = url
  return process.env.DATABASE_URL
}

export const dropTest = async () => {
  await mongoUnit.stop()
}
