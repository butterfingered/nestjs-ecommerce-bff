import { UserDto } from 'src/modules/users/dtos/user.dto'
import { TokenDto } from './token.dto'
export class LoginPayloadDto {
  user: UserDto
  token: TokenDto

  constructor(user: UserDto, token: TokenDto) {
    this.user = user
    this.token = token
  }
}
