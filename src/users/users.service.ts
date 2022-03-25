import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { uuidV4, uuidValidateV4 } from '../helpers/uuid'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    try {
      const user = await this.repo.create({ email, password, id: uuidV4 })
      const userSaved = await this.repo.save(user).catch((e) => {
        console.error('que ondaaaaa', e)
        return {} as User
      })
      return userSaved
    } catch (e) {
      throw new BadRequestException('sdsadsadsadasdsad', e)
    }
  }

  async findOne(id: string) {
    if (!uuidValidateV4(id)) throw new BadRequestException(`the id ${id} is not valid`)

    const user = await this.repo.findOne({ id })

    if (!user) throw new NotFoundException(`id ${id} not found`)

    return user
  }

  find(email: string) {
    return this.repo.find({ email })
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('error not found ')
    }
    Object.assign(user, attrs)

    return this.repo.save(user)
  }

  async remove(id: string) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('error not found ')
    }

    return this.repo.remove(user)
  }
}
