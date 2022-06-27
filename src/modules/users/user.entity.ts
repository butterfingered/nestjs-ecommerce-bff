import { Entity, Column, BeforeInsert } from 'typeorm'
import { VirtualColumn } from './decorators/virtual-column.decorator'
import { RoleType } from '../../constants/constants'
import { UserDto } from './dtos/user.dto'
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
  isEmailVerified: boolean
  isPhoneVerified: boolean
  allowEmailMarketing: boolean
  isBanned: boolean
  isActive: boolean
  emailUuid: string
  isVerificationEmailSent: boolean
  isVerificationSmsSent: boolean
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> implements IUserEntity {
  @Column({ unique: true })
  email: string

  @Column({ select: false })
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

  @Column({ nullable: true, unique: true })
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

  @Column()
  isActive: boolean

  @Column()
  emailUuid: string

  @Column()
  isVerificationEmailSent: boolean

  @Column()
  isVerificationSmsSent: boolean

  @BeforeInsert()
  beforeInsertActions() {
    this.isEmailVerified = false
    this.isPhoneVerified = false
    this.allowEmailMarketing = false
    this.isBanned = false
    this.role = RoleType.CUSTOMER
    this.isVerificationEmailSent = false
  }
}
