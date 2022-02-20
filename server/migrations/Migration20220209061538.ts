import { Migration } from '@mikro-orm/migrations';

export class Migration20220209061538 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `email` text not null, `username` text not null, `password_hash` text not null, `refresh_token` text null, `last_login_at` datetime null, `created_at` datetime not null, `updated_at` datetime not null);');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');
    this.addSql('create unique index `user_username_unique` on `user` (`username`);');
  }

}
