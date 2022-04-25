import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { setupSwagger } from './setup-swagger'
import { SharedModule } from './shared/shared.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // app.use(cookieSession({ keys: ['asdsadasdad'] })) replaced in app.mpodules.ts instead
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true })) replaced in app.module.ts instead
  const configService = app.select(SharedModule).get(AppModule)
  if (configService.documentationEnabled) setupSwagger(app)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
