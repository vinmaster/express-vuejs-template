import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Logger } from '../lib/logger';

@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    Logger.info('Entity inserted', {
      type: 'ENTITY_INSERT',
      entity: event.metadata.name,
      data: event.entity,
    });
  }

  afterUpdate(event: UpdateEvent<any>) {
    const data = event.updatedColumns.map(column => {
      const property = column.propertyName;
      return {
        property,
        from: event.databaseEntity[property],
        to: event.entity[property],
      };
    });
    Logger.info('Entity updated', {
      type: 'ENTITY_UPDATE',
      entity: event.metadata.name,
      data,
    });
  }
}
