import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthConfig, HostConfig, TwilioConfig } from '../../types'

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development'
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production'
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test'
  }

  get authConfig(): AuthConfig {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    }
  }

  get nodeMailConfig() {
    return {
      tls: {
        rejectUnauthorized: this.getBoolean('NODEMAILER_REJECT_UNAUTHORIZED'),
      },
      host: this.getString('NODEMAILER_HOST'),
      port: this.getNumber('NODEMAILER_PORT'),
      secure: this.getBoolean('NODEMAILER_SECURE'),
      auth: {
        user: this.getString('NODEMAILER_USER'),
        pass: this.getString('NODEMAILER_PASSWORD'),
      },
    }
  }

  get hostConfig(): HostConfig {
    return {
      protocol: this.getString('HOST_PROTOCOL'),
      host: this.getString('HOST'),
      port: this.getNumber('HOST_PORT'),
    }
  }

  // sms provider
  get twilioConfig(): TwilioConfig {
    return {
      accountSid: this.getString('TWILIO_ACCOUNT_SID'),
      authToken: this.getString('TWILIO_AUTH_TOKEN'),
      serviceSid: this.getString('TWILIO_SERVICE_SID'),
    }
  }

  private getNumber(key: string): number {
    const value = this.get(key)

    try {
      return Number(value)
    } catch {
      throw new Error(key + ' environment variable is not a number')
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key)

    try {
      return Boolean(JSON.parse(value))
    } catch {
      throw new Error(key + ' env var is not a boolean')
    }
  }

  private getString(key: string): string {
    const value = this.get(key)

    return value.replace(/\\n/g, '\n')
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV')
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE')
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION')
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key)

    if (this.isNullOrUndefined(value)) {
      throw new Error(key + ' environment variable does not set') // probably we should call process.exit() too to avoid locking the service
    }

    return value
  }

  isNullOrUndefined = (value: null | undefined | string): value is null | undefined => {
    return value === null || value === undefined
  }
}
