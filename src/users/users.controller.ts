import { Body, Controller, Post, Get, Patch, Param, Delete, Query, NotFoundException, Session, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { UserDto } from './dtos/user.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserEntity } from './user.entity'
import { AuthGuard } from '../guards/auth.guard'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('auth')
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
  whoAmi(@CurrentUser() user: UserEntity) {
    return user
  }
  @ApiOperation({ summary: 'Sign out' })
  @Post('signout')
  async signOut(@Session() session: any) {
    session.userId = null
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto, @Session() session: any): Promise<UserDto> {
    console.log('body', createUserDto)
    const user = await this.authService.signup(createUserDto)
    console.log('user returned in controlled', user)
    session.userId = user.id

    return user.toDto({
      isActive: true,
    })
  }

  @ApiOperation({ summary: 'Sign in' })
  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    console.log('body: ', body, 'Session', session)
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @ApiOperation({ summary: 'Find user by id' })
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running')
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException(`User with id:${id} not found`)

    return user
  }

  @ApiOperation({ summary: 'Find all users' })
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body)
  }
}
