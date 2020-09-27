import { connectDatabase, connection } from '../server/lib/database';

export async function connectDb() {
  process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost/test';
  await connectDatabase();
}

export async function closeDb() {
  if (connection.isConnected) await connection.close();
}

export async function deleteData() {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
  // await connection.getRepository('User').query(`DELETE FROM users;`);
}

// Credit to: https://gist.github.com/the-vampiire/a564af41ed0ce8eb7c30dbe6c0f627d8
const shapeFlags = flags =>
  flags.reduce((shapedFlags, flag) => {
    const [flagName, rawValue] = flag.split('=');
    // edge case where a cookie has a single flag and "; " split results in trailing ";"
    const value = rawValue ? rawValue.replace(';', '') : true;
    return { ...shapedFlags, [flagName]: value };
  }, {});

export const extractCookies = headers => {
  const cookies = headers['set-cookie']; // Cookie[]

  return cookies.reduce((shapedCookies, cookieString) => {
    const [rawCookie, ...flags] = cookieString.split('; ');
    const [cookieName, value] = rawCookie.split('=');
    return { ...shapedCookies, [cookieName]: { value, flags: shapeFlags(flags) } };
  }, {});
};
