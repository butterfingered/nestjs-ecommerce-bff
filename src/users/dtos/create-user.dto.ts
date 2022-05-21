import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Column } from 'typeorm'

import { Trim } from '../../decorators/transform.decorators'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty()
  @Column({ default: false })
  readonly isEmailVerified: boolean

  @ApiProperty()
  @Column({ default: false })
  readonly isPhoneVerified: boolean

  @ApiProperty()
  @Column({ default: false })
  readonly isBanned: boolean

  @ApiProperty()
  @Column({ default: false })
  readonly allowEmailMarketing: boolean
}
