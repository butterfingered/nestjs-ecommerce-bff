import { rm } from 'fs/promises'
import { join } from 'path'
import { getConnection } from 'typeorm'

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch (error) {}
})

globalThis.afterEach(async () => {
  const conn = getConnection()
  await conn.close()
})
