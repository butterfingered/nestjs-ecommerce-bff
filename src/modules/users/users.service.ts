import { CreateUserDto } from './dtos/create-user.dto'
import { Injectable, BadRequestException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import type { FindConditions } from 'typeorm'
import type { Optional } from '../../types'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.repo.create(createUserDto)
      const userSaved = await this.repo.save(user).catch((e) => {
        console.error('Error al guardar', e)
        return {} as UserEntity
      })
      console.log('user created and saved:', userSaved)
      return userSaved
    } catch (e) {
      throw new BadRequestException('sdsadsadsadasdsad', e)
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
    console.log('aadasdadad')
    console.log('findOne:', findData)
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
