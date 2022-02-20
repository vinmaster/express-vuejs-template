import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

const options: Options<SqliteDriver> = {
  entities: ['./build/models'],
  entitiesTs: ['./server/models'],
  dbName: `${process.env.NODE_ENV}.db`,
  // dbName: `test.db`,
  type: 'sqlite',
  migrations: {
    path: './server/migrations',
    pathTs: undefined,
  },
  // debug: true,
};

export default options;
