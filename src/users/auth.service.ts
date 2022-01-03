import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { throws } from 'assert'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string, id: string) {
    const users = await this.usersService.find(email)

    if (users.length) {
      throw new BadRequestException('this email is already taken')
    }

    const salt = randomBytes(8).toString('hex')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    const result = salt + '.' + hash.toString('hex')

    const user = await this.usersService.create(email, result, id)

    return user

    //See is the email is in use

    //hash the users password
    //generate a salt
    //hash the salt and the password together

    //Create a neww user and save it

    // return the user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    const [salt, storedHash] = user.password.split('.')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password')
    }
    return user
  }
}
