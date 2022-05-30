import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'
import { Response } from 'express'
import { ClassConstructor } from '../types'
import { ResultsDto } from '../common/dto/results.dto'

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    //Run someting before a request is handled by the request handler
    // console.log('im running before the handler', context)

    return next.handle().pipe(
      map((data: any) => {
        try {
          const response = context.switchToHttp().getResponse<Response>()

          console.log('context: ', context)
          console.log('response: ', response)

          return plainToInstance(
            this.dto,
            {
              result: {
                date: new Date().toISOString(),
                statusCode: response.statusCode || 200,
                host: response.req.hostname,
                message: 'success',
                path: response.req.url,
              },
              ...data,
            },

            { excludeExtraneousValues: true },
          )
        } catch (e) {
          console.error('Error', e)
        }
      }),
    )
  }
}
