import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Response } from 'express'

export const AuthOkMessage = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const response = ctx.switchToHttp().getResponse<Response>()
  console.log('AuthOkMessage', response)
  return response
})
