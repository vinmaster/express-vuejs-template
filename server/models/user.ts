import 'reflect-metadata';
import { Entity, PrimaryKey, Property, Unique, wrap } from '@mikro-orm/core';
import { comparePassword, hashPassword } from '../lib/authentication';
import { Utility } from '../lib/utility';
import { orm } from '../lib/database';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  email!: string;

  @Property()
  @Unique()
  username!: string;

  // Hidden will exclude from serialization
  @Property({ hidden: true })
  passwordHash!: string;

  @Property({ nullable: true })
  refreshToken?: string;

  @Property({ nullable: true, serializer: v => v && v.toISOString() })
  lastLoginAt!: Date;

  @Property({ serializer: v => v.toISOString() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), serializer: v => v.toISOString() })
  updatedAt: Date = new Date();

  @Property({ persist: false })
  password!: string;

  async hashPassword() {
    if (this.password) {
      this.passwordHash = await hashPassword(this.password);
    }
  }

  toJSON(strict = true, strip = ['passwordHash'], ...args: any[]): { [p: string]: any; } {
    const o = wrap(this, true).toObject(...args);

    if (strict) {
      strip.forEach(k => delete o[k]);
    }
    if (!o['lastLoginAt']) o['lastLoginAt'] = null;
    if (!o['refreshToken']) o['refreshToken'] = null;

    return o;
  }

  static async register({ email, username, password }: { email: string; username: string; password: string; }
  ): Promise<User> {
    const users = await orm.em.find(User, { username });
    if (users.length !== 0) throw Utility.createError('Username taken');

    const user = new User();
    user.email = email;
    user.username = username;
    user.passwordHash = await hashPassword(password);
    await orm.em.persistAndFlush(user);
    return user;
  }

  static async login({ username, password }: { username: string; password: string; }): Promise<User> {
    const user = await orm.em.findOne(User, { username });
    if (!user) throw Utility.createError('No user found');

    const success = await comparePassword(password, user.passwordHash);
    if (!success) throw Utility.createError('Wrong password');

    user.lastLoginAt = new Date();
    await orm.em.flush();

    return user;
  }
}
