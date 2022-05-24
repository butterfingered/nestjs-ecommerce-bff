import { JwtStrategy } from './jwt.strategy'
import { ApiConfigService } from '../../shared/services/api-config.service'
import { UsersModule } from '../users/users.module'
import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { PublicStrategy } from './public.strategy'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configServices: ApiConfigService) => ({
        privateKey: configServices.authConfig.privateKey,
        publicKey: configServices.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configServices.authConfig.jwtExpirationTime,
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
