import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { UserDto } from './dtos/user.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password, body.id)
  }

  @Post('signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password)
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running')
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException(`User with id:${id} not found`)

    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body)
  }
}
