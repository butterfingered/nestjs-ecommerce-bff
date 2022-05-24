import { ApiProperty } from '@nestjs/swagger'

export class TokenDto {
  @ApiProperty()
  expiresIn: number

  @ApiProperty()
  accessToken: string
  constructor(data: { expiresIn: number; accessToken: string }) {
    console.log('expiresIn:', data.expiresIn, 'accessToken:', data.accessToken)
    this.expiresIn = data.expiresIn
    this.accessToken = data.accessToken
  }
}
