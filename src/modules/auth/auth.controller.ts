import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { UserDto } from '../users/dtos/user.dto'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { Serialize } from '../../interceptors/serialize.interceptor'
import { AuthUserDto } from './dtos/auth-user.dto'
import { LoginPayloadDto } from './dtos/login-payload'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Serialize(LoginPayloadDto)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async signIn(@Body() createUserDto: CreateUserDto) {
    const userEntity = await this.authService.validateUser(createUserDto)
    const token = await this.authService.createAccesToken({ role: userEntity.role, id: userEntity.id })
    return new LoginPayloadDto(userEntity.toDto(), token)
  }

  @Serialize(AuthUserDto)
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto)
  }
}
