import { CreateUserDto } from './dtos/create-user.dto'
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { generateHash, validateHash } from 'src/helpers'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    const users = await this.usersService.find(createUserDto.email)
    console.log('users find', users.length)

    if (users.length) {
      throw new BadRequestException('this email is already taken')
    }

    const user = await this.usersService.create(createUserDto)
    console.log('user returned', user)
    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    console.log('user', user)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    if (!(await validateHash(user.password, password))) {
      throw new BadRequestException('bad password')
    }
    return user
  }
}
