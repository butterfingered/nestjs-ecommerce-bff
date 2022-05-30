import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { ResultsDto } from 'src/common/dto/results.dto'

export type UserDtoOptions = Partial<{ isActive: boolean }>

export class AuthUserDto {
  @ApiProperty()
  @Expose()
  email: string

  @Expose()
  result: ResultsDto
}
