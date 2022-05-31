import { Expose } from 'class-transformer'
import { ApiResponse } from 'src/types'

export class ApiResultDto {
  @Expose()
  apiResponse: ApiResponse
}
