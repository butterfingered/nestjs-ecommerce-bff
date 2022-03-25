import { Entity, Column, PrimaryColumn, ObjectIdColumn } from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  id: string

  @Column()
  email: string

  @Column()
  password: string
}
