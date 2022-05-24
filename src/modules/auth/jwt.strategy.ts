import { UsersService } from '../users/users.service'
import { UserEntity } from '../users/user.entity'
import { ApiConfigService } from '../../shared/services/api-config.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RoleType, TokenType } from 'src/constants/constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configServices: ApiConfigService, private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServices.authConfig.publicKey,
    })
  }

  validate(args: { id: string; role: RoleType; type: TokenType }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) throw new UnauthorizedException()

    const user = this.userService.findOne({ id: args.id, role: args.role })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
