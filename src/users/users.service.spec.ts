import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { User } from './user.entity'

describe('UsersService', () => {
  let service: UsersService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => (user.email = email))
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = { email, password } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersService, useValue: fakeUsersService }],
    }).compile()

    service = module.get(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
