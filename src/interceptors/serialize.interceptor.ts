import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'

interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {}
}

export const Serialize = (dto: ClassConstructor) => {
  const xxx = UseInterceptors(new SerializeInterceptor(dto))
  console.log('X', xxx)
  return xxx
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    //Run someting before a request is handled by the request handler
    // console.log('im running before the handler', context)

    const result = next.handle().pipe(
      map((data: any) => {
        try {
          console.log('data to expose', data, 'this.dto', this.dto)
          // run something before the response is sent out
          //  console.log('this is running before response is sent out ', data)
          console.log()
          return plainToInstance(this.dto, data, { excludeExtraneousValues: false })
        } catch (e) {
          console.error('Error', e)
        }
      }),
    )

    console.log('result', result)
    return result
  }
}
