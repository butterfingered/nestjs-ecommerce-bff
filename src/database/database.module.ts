import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection, getConnectionOptions } from 'typeorm'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoUnit = require('mongo-unit')
import { User } from '../users/user.entity'
import { Report } from '../reports/report.entity'
import { ConfigService } from '@nestjs/config'
import { startMongoInMemory } from './databaseConection'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (!configService.get<string>('DATABASE_URL') && process.env.NODE_ENV === 'dev') await startMongoInMemory()

        return {
          type: 'mongodb',
          database: configService.get<string>('database'),
          name: configService.get<string>('name'),
          url: configService.get<string>('DATABASE_URL'),
          useUnifiedTopology: configService.get<boolean>('useUnifiedTopology'),
          keepConnectionAlive: configService.get<boolean>('keepConnectionAlive'),
          synchronize: configService.get<boolean>('synchronize'),
          entities: [configService.get<string>('entities')],
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor(connection: Connection) {
    // console.log('connection', connection)
    if (connection.isConnected) console.log('DB Connected Successfully!')
  }
}
