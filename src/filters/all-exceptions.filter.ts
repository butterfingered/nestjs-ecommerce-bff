import { Catch, ExceptionFilter, HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Request, Response } from 'express'

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    response.status(httpStatus).json({
      success: 'fail',
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      ...(exception.getResponse() as {
        key: string
        args: Record<string, unknown>
      }),
    })
  }
}
