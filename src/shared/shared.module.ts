import { Global, Module } from '@nestjs/common'
import { ApiConfigService } from './services/api-config.service'
import { NodeMailerService } from './services/nodemailer.service'

const providers = [ApiConfigService, NodeMailerService]

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
