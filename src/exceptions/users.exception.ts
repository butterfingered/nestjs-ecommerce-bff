import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Error.userNotFound', error)
  }
}

export class UserBadRequestException extends BadRequestException {
  constructor(error?: string) {
    super('Error.badRequest', error)
  }
}
