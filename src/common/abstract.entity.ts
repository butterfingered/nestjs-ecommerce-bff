import { uuidV4 } from '../helpers'
import { Constructor } from '../types'
import { CreateDateColumn, UpdateDateColumn, ObjectIdColumn, PrimaryGeneratedColumn, BeforeInsert, Column } from 'typeorm'
import { AbstractDto } from './dto/abstract.dto'

export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  _id: string
  id: string
  createdAt: Date
  updatedAt: Date

  toDto(options?: O): DTO
}

export abstract class AbstractEntity<DTO extends AbstractDto = AbstractDto, O = never> implements IAbstractEntity<DTO, O> {
  @ObjectIdColumn()
  _id: string

  @PrimaryGeneratedColumn()
  id: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  private dtoClass: Constructor<DTO, [AbstractEntity, O?]>

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass

    if (!dtoClass) {
      throw new Error(`You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`)
    }

    return new this.dtoClass(this, options)
  }

  @BeforeInsert() genarate() {
    this.id = uuidV4
  }
}
