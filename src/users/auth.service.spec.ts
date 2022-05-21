import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserEntity } from './user.entity'
import { UsersService } from './users.service'

describe('AuthService', () => {
  const email = 'test@gmail.com'
  const password = '123456'
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: UserEntity[] = []

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => (user.email = email))
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = { email, password } as UserEntity
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
    const user = await service.signup(email, password)
    const [salt, hash] = user.password.split('.')

    expect(user.password).not.toEqual(password)
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('should response error if user with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ email } as UserEntity])

    await service.signup(email, password).catch((error) => {
      expect(error).toEqual(new BadRequestException('this email is already taken'))
    })
  })

  it('thow response error if sign in is called with an unused email', async () => {
    try {
      await service.signin(email, password)
    } catch (e) {
      expect(e).toEqual(new NotFoundException('user not found'))
    }
  })

  it('thow error if the password is invalid ()', async () => {
    fakeUsersService.find = () => Promise.resolve([{ email, password } as UserEntity])
    try {
      await service.signin(email, password)
    } catch (e) {
      expect(e).toEqual(new BadRequestException('bad password'))
    }
  })

  it('return a user is correct password is provided', async () => {
    await service.signup(email, password)
    const user = await service.signin(email, password)
    expect(user).toBeDefined()
  })
})
