import { TwilioModuleOptions, TwilioClient } from '../interfaces'
import * as Twilio from 'twilio'

export function createTwilioClient(options: TwilioModuleOptions): TwilioClient {
  const client = Twilio(options.accountSid, options.authToken, options.options)

  return client
}
