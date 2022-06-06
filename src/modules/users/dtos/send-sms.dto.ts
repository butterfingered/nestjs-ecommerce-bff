import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Trim } from '../../../decorators/transform.decorators'

export class SendSmsDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Trim()
  readonly phone: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Trim()
  readonly email: string
}
