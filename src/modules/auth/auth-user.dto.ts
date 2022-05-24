import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export type UserDtoOptions = Partial<{ isActive: boolean }>

export class AuthUserDto {
  @ApiProperty()
  @Expose()
  email: string
}
