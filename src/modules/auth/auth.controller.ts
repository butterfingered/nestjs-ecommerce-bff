import { Body, Controller, Get, HttpCode, HttpStatus, Post, Param } from '@nestjs/common'
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { UserDto } from '../users/dtos/user.dto'
import { SendSmsDto } from '../users/dtos/send-sms.dto'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { Serialize } from '../../interceptors/serialize.interceptor'
import { LoginPayloadDto } from './dtos/login-payload'
import { IResponse } from 'src/common/dto/response.dto'
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Serialize(LoginPayloadDto)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Successfully signed in',
  })
  async signIn(@Body() createUserDto: CreateUserDto) {
    const userEntity = await this.authService.validateUser(createUserDto)
    const token = await this.authService.createAccesToken({ role: userEntity.role, id: userEntity.id })
    return new LoginPayloadDto(userEntity.toDto().email, token)
  }

  @Serialize(IResponse)
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    const user = await this.authService.signUp(createUserDto)
    const userWithEmailUuid = await this.authService.generateEmailUuid(user.email)
    const userWithEmailUuidSaved = await this.userService.update(userWithEmailUuid)

    return await this.authService.sendVerificationEmail(userWithEmailUuidSaved.email)
  }

  @Serialize(IResponse)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'uuid',
    description: 'used to validate the user email',
    example: '49216546-8cc1-4df6-928f-4b1d12b3f441',
  })
  @ApiOkResponse({ type: IResponse, description: 'Email successfully verified' })
  // @ApiException(() => [ResponseError])
  @Get('email/verify/:uuid')
  async verifyEmail(@Param('uuid') emailUuid): Promise<IResponse> {
    return await this.authService.verifyEmail(emailUuid)
  }

  @Serialize(IResponse)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'phone',
    description: 'send verification SMS',
    example: '+34623068335',
  })
  @ApiOkResponse({ type: IResponse, description: 'sms code sent' })
  @Post('sms/verify/send-code')
  async sendSmsVerificationCode(@Body() sendSmsDto: SendSmsDto): Promise<IResponse> {
    return await this.authService.sendSmsVerificationCode(sendSmsDto)
  }

  @Serialize(IResponse)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'phone',
    description: 'validate verification phone',
    example: '+34623068335',
  })
  @ApiOkResponse({ type: IResponse, description: 'The phone number was validated' })
  @Post('sms/verify/validate-sent-code')
  async checkVerificationSmsCode(@Body() sendSmsDto: SendSmsDto): Promise<IResponse> {
    return await this.authService.checkVerificationSmsCode(sendSmsDto)
  }
}
