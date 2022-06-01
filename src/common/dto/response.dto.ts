// success: true => message, data
// success: false => errorMessage, error

import { Expose } from 'class-transformer'

export class IResponse {
  @Expose()
  success: boolean

  @Expose()
  message: string

  @Expose()
  errorMessage: string

  @Expose()
  data: any[]

  @Expose()
  error: any

  @Expose()
  date: string
}

export class ResponseError implements IResponse {
  success: boolean
  message: string
  errorMessage: string
  data: any[]
  error: any
  date: string

  constructor(infoMessage: string, data?: any) {
    this.success = false
    this.message = infoMessage
    this.data = data
    this.date = new Date().toISOString()
    console.warn(new Date().toString() + ' - [Response]: ' + infoMessage + (data ? ' - ' + JSON.stringify(data) : ''))
  }
}

export class ResponseSuccess implements IResponse {
  success: boolean
  message: string
  errorMessage: string
  data: any[]
  error: any
  date: string
  constructor(infoMessage: string, data?: any) {
    this.success = true
    this.message = infoMessage
    this.data = data
    this.date = new Date().toISOString()

    /*
    if (!notLog) {
      try {
        const offuscateRequest = JSON.parse(JSON.stringify(data))
        if (offuscateRequest && offuscateRequest.token) offuscateRequest.token = '*******'
        console.log(new Date().toString() + ' - [Response]: ' + JSON.stringify(offuscateRequest))
      } catch (error) {
        console.error(error)
      }
    }
    */
  }
}
