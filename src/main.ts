import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieSession({ keys: ['asdsadasdad'] }))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3000)
}
bootstrap()
