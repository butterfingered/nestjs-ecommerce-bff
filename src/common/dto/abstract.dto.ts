import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { AbstractEntity } from '../abstract.entity'

export class AbstractDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.createdAt = entity.createdAt
      this.updatedAt = entity.updatedAt
      this._id = entity._id
      this.id = entity.id
    }
  }
}
