import 'reflect-metadata';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { comparePassword, hashPassword } from '../lib/authentication';
import { Utility } from '../lib/utility';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  username!: string;

  // Select false excludes from queries
  @Column({ select: false })
  passwordHash!: string;

  @Column({ select: false, nullable: true })
  refreshToken!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  toJson() {
    const json = { ...this } as any;
    // @ts-ignore
    delete json['passwordHash'];
    // @ts-ignore
    delete json['refreshToken'];
    json.createdAt = json.createdAt.toString();
    json.updatedAt = json.updatedAt.toString();
    if (json.lastLoginAt) json.lastLoginAt = json.lastLoginAt.toString();
    return json;
  }

  static async register(
    email,
    username: null | string = null,
    password: null | string = null
  ): Promise<User> {
    if (Utility.isObject(email)) {
      const obj = email;
      email = obj.email;
      username = obj.username;
      password = obj.password;
    }
    if (!email || !username || !password) throw Utility.createError('Missing info');

    const users = await User.find({ username });
    if (users.length !== 0) throw Utility.createError('Username taken');

    const user = new User();
    user.email = email;
    user.username = username;
    user.passwordHash = await hashPassword(password);
    await user.save();
    return user;
  }

  static async login(username, password = null): Promise<User> {
    if (Utility.isObject(username)) {
      const obj = username;
      username = obj.username;
      password = obj.password;
    }
    const user = await User.rawGetOne({ username });
    if (!user) throw Utility.createError('No user found');

    const success = await comparePassword(password, user.passwordHash);
    if (!success) throw Utility.createError('Wrong password');

    user.lastLoginAt = new Date();
    await user.save();

    return user;
  }

  static async rawGetOne(whereQuery = {}) {
    return await User.getRepository()
      .createQueryBuilder()
      .addSelect('User.passwordHash')
      .addSelect('User.refreshToken')
      .where(whereQuery)
      .getOne();
  }
}
