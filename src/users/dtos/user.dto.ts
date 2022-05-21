import { AbstractDto } from '../../common/dto/abstract.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { UserEntity } from '../user.entity'
import { Expose } from 'class-transformer'
import { RoleType } from 'src/constants/constants'

export type UserDtoOptions = Partial<{ isActive: boolean }>

export class UserDto extends AbstractDto {
  @ApiProperty()
  @Expose()
  email: string

  @ApiPropertyOptional()
  @Expose()
  firstName?: string

  @ApiPropertyOptional()
  secondName?: string

  @ApiPropertyOptional()
  firstLastName?: string

  @ApiPropertyOptional()
  secondLastName?: string

  @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
  role: RoleType

  @ApiPropertyOptional()
  phone?: string

  @ApiPropertyOptional()
  fullName?: string

  @ApiProperty()
  isEmailVerified: boolean

  @ApiProperty()
  isPhoneVerified: boolean

  @ApiProperty()
  allowEmailMarketing: boolean

  @ApiProperty()
  isBanned: boolean

  @ApiProperty()
  isActive: boolean

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user)
    this.firstName = user.firstName
    this.email = user.email
    this.isActive = options.isActive
    this.secondName = user.secondName
    this.firstLastName = user.firstLastName
    this.secondLastName = user.secondLastName
    this.role = user.role
    this.phone = user.phone
    this.fullName = user.fullName
    this.isEmailVerified = user.isEmailVerified
    this.isPhoneVerified = user.isPhoneVerified
    this.isBanned = user.isBanned
    this.allowEmailMarketing = user.allowEmailMarketing
  }
}
