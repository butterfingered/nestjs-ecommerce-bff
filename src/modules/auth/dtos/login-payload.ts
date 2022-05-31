import { TokenDto } from './token.dto'
import { Expose } from 'class-transformer'
import { ApiResultDto } from 'src/common/dto/api-result.dto'

export class LoginPayloadDto extends ApiResultDto {
  @Expose()
  email: string

  @Expose()
  token: TokenDto

  constructor(email: string, token: TokenDto) {
    super()
    this.email = email
    this.token = token
  }
}
