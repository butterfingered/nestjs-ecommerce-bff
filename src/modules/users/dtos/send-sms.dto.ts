import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { Trim } from '../../../decorators/transform.decorators'

export class SendSmsDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Trim()
  readonly phone: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Trim()
  readonly email: string

  @ApiProperty()
  @IsString()
  readonly code: string
}
