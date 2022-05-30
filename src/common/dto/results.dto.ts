import { Expose } from 'class-transformer'

export class ResultsDto {
  @Expose()
  statusCode: number

  @Expose()
  message: string

  @Expose()
  date: string

  @Expose()
  host: string

  @Expose()
  path: string

  @Expose()
  data: any

  constructor(data: any) {
    console.log()
    this.data = data
  }
}
