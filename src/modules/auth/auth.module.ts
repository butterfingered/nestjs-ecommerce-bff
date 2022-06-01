import { NodeMailerService } from '../../shared/services/nodemailer.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Module, forwardRef } from '@nestjs/common'
import { JwtStrategy } from './jwt.strategy'
import { AuthService } from './auth.service'
import { ApiConfigService } from '../../shared/services/api-config.service'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
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
  providers: [AuthService, JwtStrategy, PublicStrategy, NodeMailerService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
