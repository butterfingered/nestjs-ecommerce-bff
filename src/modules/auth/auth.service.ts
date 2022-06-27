import { SmsService } from './../../shared/services/sms.service'
import { NodeMailerService } from '../../shared/services/nodemailer.service'
import { JwtService } from '@nestjs/jwt'
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, HttpException } from '@nestjs/common'
import { RoleType, TokenType } from '../../constants/constants'
import { ApiConfigService } from '../../shared/services/api-config.service'
import { UsersService } from '../users/users.service'
import { TokenDto } from './dtos/token.dto'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { validateHash } from '../../helpers'
import { UserEntity } from '../users/user.entity'
import { UserBadRequestException, UserNotFoundException } from '../../exceptions/users.exception'
import { ResponseSuccess, IResponse } from 'src/common/dto/response.dto'
import { SendSmsDto } from '../users/dtos/send-sms.dto'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UsersService,
    private nodeMailService: NodeMailerService,
    private smsService: SmsService,
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
    const [user] = await this.userService.find(createUserDto)

    if (!user) throw new NotFoundException('SIGN_IN.USER_NOT_FOUND')

    const isPasswordValidate = await validateHash(user.password, createUserDto.password)
    if (!isPasswordValidate) throw new UserBadRequestException('SIGN_IN.PASSWORD_DOESNT_MATCH')

    return user
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto
    const users = await this.userService.find({ email })

    if (users.length) throw new UserBadRequestException('SIGN_UP.EMAIL_ALREADY_TAKEN')

    return await this.userService.create(createUserDto)
  }

  async generateEmailUuid(email: string): Promise<UserEntity> {
    const user = await this.userService.findOne({ email })
    return this.userService.generateEmailUuid(user)
  }

  async sendVerificationEmail(email: string): Promise<IResponse> {
    const user = await this.userService.findOne({ email })

    if (!user) throw new UserNotFoundException('SIGP_UP.USER_NOT_REGISTERED')

    if (user.isVerificationEmailSent) throw new UserBadRequestException('SIGP_UP.VERIFICATION_EMAIL_ALREADY_SENT')

    if (user.isEmailVerified) throw new UserBadRequestException('SIGP_UP.USER_ALREADY_VERIFIED')

    const emailSent = await this.nodeMailService.sendVerificationEmail(user)
    if (!emailSent) throw new UserBadRequestException('SIGP_UP.EMAIL_NOT_SENT')

    user.isVerificationEmailSent = true
    this.userService.update(user)
    return new ResponseSuccess('SIGP_UP.USER_REGISTERED_SUCCESSFULLY')
  }

  async sendSmsVerificationCode(sendSmsDto: SendSmsDto): Promise<IResponse> {
    const { phone, email } = sendSmsDto
    const user = await this.userService.findOne({ email })

    if (!user) throw new NotFoundException('REGISTER.USER_NOT_FOUND_TO_START_THE_SMS_VALIDATION_PROCESS')

    // if (user.phone !== phone) throw new BadRequestException('REGISTER.USER_PHONE_DOESNT_MATCH')
    if (user.isVerificationSmsSent) throw new UserBadRequestException('REGISTER.VERIFICATION_SMS_ALREADY_SENT')

    await this.smsService.sendSmsVerificationCode(phone)
    user.isVerificationSmsSent = true
    this.userService.update(user)
    return new ResponseSuccess('REGISTER.USER_SMS_CODE_SENT_SUCCESSFULLY')
  }

  async checkVerificationSmsCode(sendSmsDto: SendSmsDto): Promise<IResponse> {
    const { phone, email, code } = sendSmsDto
    const user = await this.userService.findOne({ email })
    if (!user) throw new NotFoundException('REGISTER.USER_NOT_FOUND_TO_START_THE_SMS_VALIDATION_CODE_PROCESS')

    if (user.isPhoneVerified) throw new UserBadRequestException('REGISTER.USER_PHONE_IS_ALREADY_VERIFIED')

    const isPhoneValid = await this.smsService.checkVerificationSmsCode(phone, code)
    if (!isPhoneValid) throw new UserBadRequestException('REGISTER.USER_SMS_CODE_IS_NOT_VALID')

    user.phone = phone
    user.isPhoneVerified = true
    this.userService.update(user)
    return new ResponseSuccess('REGISTER.USER_SMS_VALIDATE_SUCCESSFULLY')
  }

  async verifyEmail(emailUuid: string): Promise<IResponse> {
    try {
      const user = await this.userService.findOne({ emailUuid })

      if (!user) throw new NotFoundException('EMAIL_UUID_NOT_FOUND_FOR_VALIDATION')

      if (user.isEmailVerified) throw new UserBadRequestException('REGISTER.USER_EMAIL_ALREADY_VERIFIED')

      user.isEmailVerified = true
      await this.userService.update(user)
      return new ResponseSuccess('REGISTER.USER_VERIFIED_SUCCESSFULLY')
    } catch (e) {
      throw new HttpException(e, e.status)
    }
  }
}
