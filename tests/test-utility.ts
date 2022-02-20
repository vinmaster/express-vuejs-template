import { connect, orm } from '../server/lib/database';

export async function connectDb() {
  process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost/test';
  await connect();
  orm.config.set('allowGlobalContext', true);

  // const migrator = orm.getMigrator();
  // await migrator.createMigration();
  // await migrator.up();
}

export async function clearData() {
  const schema = orm.getSchemaGenerator();
  // schema.refreshDatabase();
  await schema.dropSchema();
  await schema.createSchema();
  // await schema.updateSchema();
}

export async function closeDb() {
  if (await orm.isConnected()) await orm.close(true);
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
