import { Entity, Column, PrimaryColumn, ObjectIdColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column()
  email: string

  @Column()
  password: string
}
