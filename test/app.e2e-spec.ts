import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, BadRequestException } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { User } from '../src/users/user.entity'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })

  it('handles a signup request', async () => {
    const user = { email: 'test8@gmail.com', password: '123456' }
    const res = await request(app.getHttpServer()).post('/auth/signup').send(user).expect(201)
    const { id, email } = res.body as User
    expect(id).toBeDefined()
    expect(email).toEqual(email)
  })
})
