import { Body, Controller, Post, Get, Patch, Param, Delete, Query, NotFoundException, Session, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { UserDto } from './dtos/user.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from './user.entity'
import { AuthGuard } from '../guards/auth.guard'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    console.log('session.color', session.color)
    return session.color
  }

  /*  
  @Get('/whoami')
  whoAmi(@Session() session: any) {
    return this.usersService.findOne(session.userId)
  }*/

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmi(@CurrentUser() user: User) {
    return user
  }

  @Post('signout')
  async signOut(@Session() session: any) {
    session.userId = null
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log('body', body)
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
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
