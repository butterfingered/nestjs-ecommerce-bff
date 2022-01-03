import { IsEmail, IsString, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  id: string

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  passwrod: string
}
