import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersService } from './users.service'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []

    fakeUsersService = {
      find: (email: string) => {
        const filteredusers = users.filter((user) => (user.email = email))
        return Promise.resolve(filteredusers)
      },
      create: (email: string, password: string) => {
        const user = { email, password } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('should sign up a new user with a salted and hashed password ', async () => {
    const password = '123456'
    const user = await service.signup('test1@gmail.com', password)
    const [salt, hash] = user.password.split('.')

    expect(user.password).not.toEqual(password)
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('should response error if user with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'test1@gmail.com',
        } as User,
      ])

    await service.signup('a1@gmail.com', '123456').catch((error) => {
      expect(error).toEqual(new BadRequestException('this email is already taken'))
    })
  })

  it('thow response error if sign in is called with an unused email', async () => {
    const password = '123456'
    try {
      await service.signin('test1@gmail.com', password)
    } catch (e) {
      expect(e).toEqual(new NotFoundException('user not found'))
    }
  })

  it('thow error if the password is invalid', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'test1@gmail.com',
          password: '123456',
        } as User,
      ])

    try {
      await service.signin('test1@gmail.com', '123456')
    } catch (e) {
      expect(e).toEqual(new BadRequestException('bad password'))
    }
  })

  it('return a user is correct passwordis provided', async () => {
    await service.signup('test1@gmail.com', '123456')

    const user = await service.signin('test1@gmail.com', '123456')
    expect(user).toBeDefined()
  })
})
