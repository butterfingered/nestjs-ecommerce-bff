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

  async sendSmsVerificationCode(phone: string) {
    try {
      return await this.twilioClient.verify
        .services(this.configService.twilioConfig.serviceSid)
        .verifications.create({ to: phone, channel: 'sms', locale: 'es' })
        .then((verification) => {
          console.log('verification:', verification.status)
          return verification.status
        })
    } catch (e) {
      console.error(`${e}`)
      throw new HttpException(e, e.status)
    }
  }
  async checkVerificationSmsCode(phone: string, code: string) {
    try {
      return await this.twilioClient.verify
        .services(this.configService.twilioConfig.serviceSid)
        .verificationChecks.create({ to: phone, code: code })
        .then((verification) => {
          console.log('phone code:', verification.valid)
          return verification.valid
        })
    } catch (e) {
      console.error(`${e}`)
      throw new HttpException(e, e.status)
    }
  }
}
