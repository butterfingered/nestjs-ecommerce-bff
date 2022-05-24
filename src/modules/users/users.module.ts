import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { UsersService } from './users.service'
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { UserEntity } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }],
  exports: [UsersService],
})
export class UsersModule {}
