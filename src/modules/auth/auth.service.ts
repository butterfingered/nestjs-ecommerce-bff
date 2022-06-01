import { NodeMailerService } from '../../shared/services/nodemailer.service'
import { JwtService } from '@nestjs/jwt'
import { Injectable, BadRequestException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common'
import { RoleType, TokenType } from '../../constants/constants'
import { ApiConfigService } from '../../shared/services/api-config.service'
import { UsersService } from '../users/users.service'
import { TokenDto } from './dtos/token.dto'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { validateHash } from '../../helpers'
import { UserEntity } from '../users/user.entity'
import { UserBadRequestException, UserNotFoundException } from '../../exceptions/users.exception'
import { ResponseSuccess, ResponseError, IResponse } from 'src/common/dto/response.dto'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UsersService,
    private nodeMailService: NodeMailerService,
  ) {}

  async createAccesToken(data: { role: RoleType; id: string }): Promise<TokenDto> {
    try {
      const accessToken = await this.jwtService.signAsync({ id: data.id, type: TokenType.ACCESS_TOKEN, role: data.role }).catch((e) => {
        throw new InternalServerErrorException('error creating accessToken', e)
      })

      const refrehToken = await this.jwtService.signAsync({ id: data.id, type: TokenType.REFRESH_TOKEN, role: data.role }).catch((e) => {
        throw new InternalServerErrorException('error creating refrehToken', e)
      })

      return new TokenDto({
        expiresIn: this.configService.authConfig.jwtExpirationTime,
        accessToken: accessToken,
        refreshToken: refrehToken,
      })
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async validateUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const [user] = await this.userService.find(createUserDto.email)

    if (!user) throw new UserNotFoundException()

    const isPasswordValidate = await validateHash(user.password, createUserDto.password)
    if (!isPasswordValidate) throw new UserBadRequestException('REGISTER.PASSWORD_DOESNT_MATCH')

    return user
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const users = await this.userService.findUsersByEmail(createUserDto.email)

    if (users.length) throw new UserBadRequestException('REGISTER.EMAIL_ALREADY_TAKEN')

    return await this.userService.create(createUserDto)
  }

  async generateEmailUuid(email: string): Promise<UserEntity> {
    const user = await this.userService.findUserByEmail(email)
    return this.userService.generateEmailUuid(user)
  }

  async sendVerificationEmail(email: string): Promise<IResponse> {
    const user = await this.userService.findUserByEmail(email)

    if (!user && !user.emailUuid) throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN)

    const emailSent = await this.nodeMailService.sendVerificationEmail(user)

    if (emailSent) {
      return new ResponseSuccess('REGISTRATION.USER_REGISTERED_SUCCESSFULLY')
    } else {
      return new ResponseError('REGISTRATION.ERROR.MAIL_NOT_SENT')
    }
  }
}
