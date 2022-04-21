import * as request from 'supertest'
import { User } from '../src/users/user.entity'
import { app } from './setup'
import { dropTest } from '../src/database/databaseConection'

describe('AppController (e2e)', () => {
  it('handles a signup request', async () => {
    const user = { email: 'test1@gmail.com', password: '123456' }
    const res = await request(app.getHttpServer()).post('/auth/signup').send(user).expect(201)
    const { id, email } = res.body as User
    expect(id).toBeDefined()
    expect(email).toEqual(email)
    await dropTest()
  })

  /*
  it('signup as a new user then get the currently logged in user', async () => {
    const user = { email: 'test8@gmail.com', password: '123456' }
    const res = await request(app.getHttpServer()).post('/auth/signup').send(user).expect(201)
    const cookie = res.get('Set-Cookie')
    const { body } = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', cookie).expect(200)
    console.log('Body', body)
    expect(body.email).toEqual(user.email)
  })

  */
  /*
  it('/ (GET)', () => {
    console.log('/get test ok')
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })

  */
})
