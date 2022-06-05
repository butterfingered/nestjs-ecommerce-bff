import { Global, Module } from '@nestjs/common'
import { ApiConfigService } from './services/api-config.service'
import { NodeMailerService } from './services/nodemailer.service'
import { SmsService } from './services/sms.service'

const providers = [ApiConfigService, NodeMailerService, SmsService]

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
