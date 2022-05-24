import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export type UserDtoOptions = Partial<{ isActive: boolean }>

export class AuthUserDto {
  @ApiProperty()
  @Expose()
  email: string
}
