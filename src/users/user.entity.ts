import { generateHash } from 'src/helpers'
import { Entity, Column, BeforeInsert } from 'typeorm'
import { VirtualColumn } from './decorators/virtual-column.decorator'
import { RoleType } from '../constants/constants'
import { UserDto, UserDtoOptions } from './dtos/user.dto'
import { UseDto } from './decorators/use-dto.decorator'
import { IAbstractEntity, AbstractEntity } from 'src/common/abstract.entity'

export interface IUserEntity extends IAbstractEntity<UserDto> {
  email: string
  password: string
  firstName?: string
  secondName?: string
  firstLastName?: string
  secondLastName?: string
  fullName?: string
  role?: RoleType
  phone?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  allowEmailMarketing?: boolean
  isBanned?: boolean
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> implements IUserEntity {
  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  firstName?: string

  @Column({ nullable: true })
  secondName?: string

  @Column({ nullable: true })
  firstLastName?: string

  @Column({ nullable: true })
  secondLastName?: string

  @Column()
  role: RoleType

  @Column({ nullable: true })
  phone?: string

  @VirtualColumn()
  fullName?: string

  @Column()
  isEmailVerified: boolean

  @Column()
  isPhoneVerified: boolean

  @Column()
  allowEmailMarketing: boolean

  @Column()
  isBanned: boolean

  @BeforeInsert()
  beforeInsertActions() {
    this.isEmailVerified = false
    this.isPhoneVerified = false
    this.allowEmailMarketing = false
    this.isBanned = false
    this.role = RoleType.CUSTOMER
  }
}
