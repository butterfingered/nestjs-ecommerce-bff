import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ReportsModule } from './reports/reports.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/user.entity'
import { Report } from './reports/report.entity'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          url: '',
          database: config.get<string>('DB_NAME'),
          keepConnectionAlive: true,
          entities: [User, Report],
          synchronize: true,
        }
      },
    }),
    /*
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: '',
      database: 'localdb',
      useUnifiedTopology: true,
      entities: [User, Report],
      synchronize: true,
      keepConnectionAlive: true,
    }),

    */
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['cookieSession'] })).forRoutes('*')
  }
}
