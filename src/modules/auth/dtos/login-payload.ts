import { TokenDto } from './token.dto'
import { Expose } from 'class-transformer'

export class LoginPayloadDto {
  @Expose()
  email: string

  @Expose()
  token: TokenDto

  constructor(email: string, token: TokenDto) {
    this.email = email
    this.token = token
  }
}
