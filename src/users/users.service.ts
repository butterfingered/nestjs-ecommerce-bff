import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string, id: string) {
    const user = await this.repo.create({ email, password, id })
    return this.repo.save(user)
  }

  findOne(id: string) {
    const user = this.repo.findOne(id)

    if (!user) console.log('error')

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
