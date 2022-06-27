import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './user.entity'
import type { FindConditions } from 'typeorm'
import type { Optional } from '../../types'
import { uuidV4 } from 'src/helpers'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.repo.save(user).catch((e) => {
      throw new InternalServerErrorException(`USERS.ERROR.ON_SAVE_METHOD - ${e.message}`)
    })
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.repo.create(createUserDto)
      return await this.save(user)
    } catch (e) {
      throw new InternalServerErrorException(`USERS.ERROR_ON_CREATE_USER - ${e}`)
    }
  }

  async update(user: UserEntity): Promise<UserEntity> {
    return await this.save(user)
  }

  async findOne(findData: FindConditions<UserEntity>): Promise<Optional<UserEntity>> {
    return await this.repo.findOne(findData).catch((e) => {
      throw new InternalServerErrorException(`USERS.ERROR.ON_FIND_ONE_PROCESS ${e}`)
    })
  }

  async find(findData: FindConditions<UserEntity>): Promise<UserEntity[]> {
    return await this.repo.find(findData).catch((e) => {
      throw new InternalServerErrorException(`USERS.ERROR.ON_FIND_ONE_PROCESS ${e}`)
    })
  }

  generateEmailUuid(user: UserEntity): UserEntity {
    user.emailUuid = uuidV4
    return user
  }
}
