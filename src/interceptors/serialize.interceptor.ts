import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'
import { Response } from 'express'
import { ClassConstructor } from '../types'

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        try {
          console.log('data:', data)
          const response = context.switchToHttp().getResponse<Response>()
          response.statusMessage = 'success'
          // const plainData = instanceToPlain(data)
          //  console.log('plainData', plainData)
          //   console.log('this.dto', this.dto)

          return plainToInstance(this.dto, { ...data }, { excludeExtraneousValues: true })
        } catch (e) {
          throw new Error('Error al transformar de plano a instancia')
        }
      }),
    )
  }
}
