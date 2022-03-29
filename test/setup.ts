import { dropTest } from '../src/database/databaseConection'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { startMongoInMemory } from '../src/database/databaseConection'
import { getConnection } from 'typeorm'

export let app: INestApplication

globalThis.beforeAll(async () => startMongoInMemory())
globalThis.beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleFixture.createNestApplication()
  await app.init()
})

globalThis.afterEach(async () => {
  const connection = getConnection('test_seomanager')
  console.log('connection.isConnected', getConnection('test_seomanager'))
  if (connection && connection.isConnected) {
    connection.close()
    await dropTest()
  }
})
