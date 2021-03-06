import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { UsersModule } from './modules/users/users.module'
import { ReportsModule } from './reports/reports.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from './shared/shared.module'
import { ApiConfigService } from './shared/services/api-config.service'
import { Connection } from 'typeorm'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session')

import { startMongoInMemory } from './database/databaseConection'
import { UserSubscriber } from './entity-subscribers/user-subscriber'
import { AuthModule } from './modules/auth/auth.module'
import { TwilioModule } from './modules/twilio'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => {
        if (!configService.get<string>('DATABASE_URL') && process.env.NODE_ENV === 'dev')
          return {
            type: 'mongodb',
            database: configService.get<string>('database'),
            name: configService.get<string>('name'),
            url: configService.get<string>('DATABASE_URL'),
            useUnifiedTopology: configService.get<boolean>('useUnifiedTopology'),
            keepConnectionAlive: configService.get<boolean>('keepConnectionAlive'),
            synchronize: true,
            entities: [configService.get<string>('entities')],
            subscribers: [UserSubscriber],
          }
      },

      inject: [ApiConfigService],
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        accountSid: configService.twilioConfig.accountSid,
        authToken: configService.twilioConfig.authToken,
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService, connection: Connection) {
    if (connection.isConnected) console.log('DB Connected Successfully!')
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: [this.configService.get<string>('COOKIE_KEY')] })).forRoutes('*')
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key)

    if (this.isNullOrUndefined(value)) {
      throw new Error(key + ' environment variable does not set') // probably we should call process.exit() too to avoid locking the service
    }

    return value
  }

  isNullOrUndefined = (value: null | undefined | string): value is null | undefined => {
    return value === null || value === undefined
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key)
    try {
      return Boolean(JSON.parse(value))
    } catch {
      throw new Error(key + ' env var is not a boolean')
    }
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION')
  }
}
