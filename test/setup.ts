import { rm } from 'fs/promises'
import { join } from 'path'
import { getConnection } from 'typeorm'
import mongoUnit from 'mongo-unit'

global.beforeEach(async () => {})

globalThis.afterEach(async () => {
  const conn = getConnection()
  await conn.close()
 // mongoUnit.stop()
})
