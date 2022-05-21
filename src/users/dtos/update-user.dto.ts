import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  passwrod: string
}
