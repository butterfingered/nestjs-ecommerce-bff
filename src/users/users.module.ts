import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { UsersService } from './users.service'
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { UsersController } from './users.controller'
import { UserEntity } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }],
})
export class UsersModule {}
