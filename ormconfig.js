// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoUnit = require('mongo-unit')
const dbConfig = {
  synchronize: true,
}
switch (process.env.NODE_ENV) {
  case 'dev':
    Object.assign(dbConfig, {
      type: 'mongodb',
      url: 'mongodb://localhost/dev_seomanager',
      database: 'dev_seomanager',
      entities: ['**/*.entity.js'],
      synchronize: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
    })
    break
  case 'test':
    mongoUnit
      .start()
      .then(() => {
        console.log('fake mongo is started: ', mongoUnit.getUrl())
        process.env.DATABASE_URL = mongoUnit.getUrl() // this var process.env.DATABASE_URL = will keep link to fake mongo
        console.log('process.env.DATABASE_URL', process.env.DATABASE_URL)
      })
      .catch((error) => {
        console.error('este es el error', error)
      })

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
