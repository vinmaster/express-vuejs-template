import path from 'path';
import { createConnection, Connection, getConnectionManager } from 'typeorm';
import { Utility } from './utility';

export let connection: Connection;

export async function connectDatabase() {
  try {
    console.log(__dirname);
    connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [path.join(__dirname, '../models/*.ts'), path.join(__dirname, '../models/*.js')],
      logging: Utility.env !== 'test',
      synchronize: true,
      subscribers: [
        path.join(__dirname, '../models/hooks.ts'),
        path.join(__dirname, '../models/hooks.js'),
      ],
    });
  } catch (error) {
    if (error.name === 'AlreadyHasActiveConnectionError') {
      connection = getConnectionManager().get('default');
    } else {
      console.error(error);
    }
  }
}
