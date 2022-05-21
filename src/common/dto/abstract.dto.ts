import { ApiProperty } from '@nestjs/swagger'
import { AbstractEntity } from '../abstract.entity'

export class AbstractDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  id: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      console.log('this =>', this, 'entity:', entity)
      this.createdAt = entity.createdAt
      this.updatedAt = entity.updatedAt
      this._id = entity._id
      this.id = entity.id
    }
  }
}
