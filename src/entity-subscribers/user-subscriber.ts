import type { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm'
import { EventSubscriber } from 'typeorm'

import { generateHash } from '../helpers/index'
import { UserEntity } from '../modules/users/user.entity'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    if (event.entity.password) {
      event.entity.password = await generateHash(event.entity.password)
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    // FIXME check event.databaseEntity.password
    const entity = event.entity as UserEntity

    if (entity.password !== event.databaseEntity.password) {
      entity.password = await generateHash(entity.password)
    }
  }
}
