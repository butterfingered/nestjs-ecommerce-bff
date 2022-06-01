import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './user.entity'
import type { FindConditions } from 'typeorm'
import type { Optional } from '../../types'
import { UserBadRequestException } from '../../exceptions/users.exception'
import { uuidV4 } from 'src/helpers'

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
    const user = this.repo.findOne(findData)
    console.log('user founded', user)
    return user
  }

  async find(email: string) {
    const users = await this.repo.find({ email })
    console.log('users founded', users)
    return users
  }

  async update(user: UserEntity): Promise<UserEntity> {
    return await this.repo.save(user)
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const [user] = await this.find(email)
    return user
  }

  async findUsersByEmail(email: string): Promise<UserEntity[]> {
    return await this.find(email)
  }

  generateEmailUuid(user: UserEntity): UserEntity {
    user.emailUuid = uuidV4
    return user
  }

  /*
  async remove(id: string) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('error not found ')
    }

    return this.repo.remove(user)
  }

  */
}
