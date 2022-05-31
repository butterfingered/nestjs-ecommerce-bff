import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance, instanceToPlain } from 'class-transformer'
import { Response } from 'express'
import { ApiResponse, ClassConstructor } from '../types'

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        try {
          const response = context.switchToHttp().getResponse<Response>()
          const plainData = instanceToPlain(data)
          response.statusMessage = 'success'

          plainData.apiResponse = {
            date: new Date().toISOString(),
            host: response.req.hostname,
            path: response.req.url,
          } as ApiResponse
          return plainToInstance(this.dto, { ...plainData }, { excludeExtraneousValues: true })
        } catch (e) {
          throw new Error('Error al transformar de plano a instancia')
        }
      }),
    )
  }
}
