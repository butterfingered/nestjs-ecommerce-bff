import { ApiConfigService } from './api-config.service'
import { Injectable, HttpException } from '@nestjs/common'
import { TwilioClient, InjectTwilio } from '../../modules/twilio'

@Injectable()
export class SmsService {
  constructor(
    @InjectTwilio()
    private readonly twilioClient: TwilioClient,
    private readonly configService: ApiConfigService,
  ) {}

  async sendVerificatinSms(phone: string) {
    try {
      return await this.twilioClient.verify.services(this.configService.twilioConfig.serviceSid).verifications.create({ to: phone, channel: 'sms' })
    } catch (e) {
      console.error(`${e}`)
      throw new HttpException(e, e.status)
    }
  }
}
