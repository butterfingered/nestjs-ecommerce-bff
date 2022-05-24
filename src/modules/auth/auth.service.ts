import { RoleType, TokenType } from '../../constants/constants'
import { ApiConfigService } from '../../shared/services/api-config.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { TokenDto } from './token.dto'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { validateHash } from '../../helpers'
import { UserEntity } from '../users/user.entity'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private configService: ApiConfigService, private userService: UsersService) {}

  async createAccesToken(data: { role: RoleType; id: string }): Promise<TokenDto> {
    return new TokenDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({ id: data.id, type: TokenType.ACCESS_TOKEN }),
    })
  }

  async validateUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const [user] = await this.userService.find(createUserDto.email)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    if (!(await validateHash(user.password, createUserDto.password))) {
      throw new BadRequestException('bad password')
    }
    return user
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const users = await this.userService.find(createUserDto.email)

    if (users.length) {
      throw new BadRequestException('this email is already taken')
    }

    return await this.userService.create(createUserDto)
  }
}
