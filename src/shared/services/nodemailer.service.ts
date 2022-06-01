import { UserEntity } from '../../modules/users/user.entity'
import * as nodemailer from 'nodemailer'
import { ApiConfigService } from './api-config.service'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import smtpTransport from 'nodemailer/lib/smtp-transport'
import { generateAuthenticationEmail } from '../../helpers'

@Injectable()
export class NodeMailerService {
  constructor(private configService: ApiConfigService) {}

  async createTransport(): Promise<nodemailer.Transporter<smtpTransport.SentMessageInfo>> {
    try {
      return await nodemailer.createTransport({ ...this.configService.nodeMailConfig })
    } catch (e) {
      throw new InternalServerErrorException(`Error creating transport ${e}`)
    }
  }

  async sendVerificationEmail(user: UserEntity) {
    const transporter = await this.createTransport()
    try {
      const email = generateAuthenticationEmail(user, this.configService.hostConfig)
      return await new Promise<boolean>(async function (resolve, reject) {
        return transporter.sendMail(email, async (error, info) => {
          if (error) {
            console.error('error connecting', error, info)
            return reject(false)
          }
          transporter.close()
          return resolve(true)
        })
      })
    } catch (e) {
      transporter.close()
      throw new InternalServerErrorException(`Error on send verification method ${e}`)
    }
  }
}
