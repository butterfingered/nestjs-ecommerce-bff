import { Expose } from 'class-transformer'
import { ApiResultDto } from 'src/common/dto/api-result.dto'

export type UserDtoOptions = Partial<{ isActive: boolean }>

export class AuthUserDto extends ApiResultDto {
  @Expose()
  email: string
}
