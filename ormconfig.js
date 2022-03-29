// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = {
  synchronize: true,
}
switch (process.env.NODE_ENV) {
  case 'dev':
    console.log('leyendo archivo')
    Object.assign(dbConfig, {
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      database: 'dev_seomanager',
      entities: ['**/*.entity.js'],
      synchronize: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
    })
    console.log('conecction', dbConfig)
    break
  case 'test':
    Object.assign(dbConfig, {
      type: 'mongodb',
      database: 'memory',
      url: process.env.DATABASE_URL,
      entities: ['**/*.entity.ts'],
      migrationsRun: false,
      synchronize: true,
      useUnifiedTopology: true,
      migrations: ['migrations/*.js'],
      cli: {
        migrationsDir: 'migrations',
      },
    })
    break
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      migrations: ['migrations/*.js'],
      cli: {
        migrationsDir: 'migrations',
      },
      entities: ['**/*.entity.js'],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    })
    break
  default:
    throw new Error('Unknown environment')
}

module.exports = dbConfig
