import { Controller, Post, Get, Param, Session, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserEntity } from './user.entity'
import { AuthGuard } from '../../guards/auth.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
}
