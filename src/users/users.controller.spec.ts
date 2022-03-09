import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'

describe('UsersController', () => {
  const id = '1'
  const email = 'test@gmail.com'
  const password = '123456'
  const session = { userId: '-10' }
  const userDto = { email, password }
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) => {
        return Promise.resolve({ id, email: '123@gmail.com' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: '123456', email } as User])
      },
      //remove: () => {},
      //  update: () => {},
    }

    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve({ id, email, password } as User),

      signin: (email: string, password: string) => Promise.resolve({ id, email, password } as User),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('Controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('Should find a user', async () => {
    const user = await controller.findUser(id)
    expect(user).toBeDefined()
  })

  it('Should not find a user', async () => {
    fakeUsersService.findOne = () => undefined
    await controller.findUser(id).catch((e) => expect(e).toEqual(new NotFoundException(`User with id:${id} not found`)))
  })

  it('should find all users', async () => {
    const users = await controller.findAllUsers(email)
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual(email)
  })

  it('signin updates session object and return user', async () => {
    const user = await controller.signin(userDto, session)
    expect(user.id).toEqual('1')
    expect(session.userId).toEqual('1')
  })

  it('signup create a new user, with session', async () => {
    const user = await controller.createUser(userDto, session)
    expect(user.id).toEqual('1')
    expect(session.userId).toEqual('1')
  })
})
