import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // app.use(cookieSession({ keys: ['asdsadasdad'] })) replaced in app.mpodules.ts instead
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true })) replaced in app.module.ts instead
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
