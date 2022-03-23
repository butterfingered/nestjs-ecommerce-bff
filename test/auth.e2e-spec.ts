import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, BadRequestException } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
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

  it('signup as a new user then get the currently logged in user', async () => {
    const user = { email: 'test1@gmail.com', password: '123456' }
    const res = await request(app.getHttpServer()).post('/auth/signup').send(user).expect(201)
    const cookie = res.get('Set-Cookie')
    const { body } = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', cookie).expect(200)
    console.log('Body', body)
    expect(body.email).toEqual(user.email)
  })
})
