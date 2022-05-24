import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './user.entity'
import type { FindConditions } from 'typeorm'
import type { Optional } from '../../types'
import { UserBadRequestException } from '../../exceptions/users.exception'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.repo.create(createUserDto)
      return await this.repo.save(user).catch(() => ({} as UserEntity))
    } catch (e) {
      throw new UserBadRequestException(e)
    }
  }

  /*
  async findOne(id: string) {
    if (!uuidValidateV4(id)) throw new BadRequestException(`the id ${id} is not valid`)

    const user = await this.repo.findOne({ id })

    if (!user) throw new NotFoundException(`id ${id} not found in db`)

    return user
  }
  */

  findOne(findData: FindConditions<UserEntity>): Promise<Optional<UserEntity>> {
    return this.repo.findOne(findData)
  }

  find(email: string) {
    return this.repo.find({ email })
  }

  /*
  async update(id: string, attrs: Partial<UserEntity>) {
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

  */
}
