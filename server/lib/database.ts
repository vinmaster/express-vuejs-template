import { MikroORM } from '@mikro-orm/core';
import type { SqliteDriver } from '@mikro-orm/sqlite';
import config from '../../mikro-orm.config';

export let orm: MikroORM;

export async function connect() {
  orm = await MikroORM.init<SqliteDriver>(config);
  console.log(orm.em);
}
