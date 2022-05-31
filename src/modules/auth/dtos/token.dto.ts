import { ApiProperty } from '@nestjs/swagger'

export class TokenDto {
  @ApiProperty()
  expiresIn: number

  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string

  constructor(data: { expiresIn: number; accessToken: string; refreshToken: string }) {
    this.expiresIn = data.expiresIn
    this.accessToken = data.accessToken
    this.refreshToken = data.refreshToken
  }
}
