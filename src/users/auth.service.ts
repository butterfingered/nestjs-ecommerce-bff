import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)
    console.log('users find', users, users.length)

    if (users.length) {
      throw new BadRequestException('this email is already taken')
    }

    const salt = randomBytes(8).toString('hex')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    const result = salt + '.' + hash.toString('hex')
    console.log('result', result)
    const user = await this.usersService.create(email, result)

    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    console.log('user', user)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    const [salt, storedHash] = user.password.split('.')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    console.log('Hash:', hash, 'storedHash', storedHash)
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password')
    }
    return user
  }
}
