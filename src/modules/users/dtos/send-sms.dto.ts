import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class SendSmsDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  readonly phone: string
}
