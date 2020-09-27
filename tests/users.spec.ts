import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../server/app';
import { getAccessToken } from '../server/lib/authentication';
import { User } from '../server/models/user';
import { closeDb, connectDb, deleteData, extractCookies } from './test-utility';

before(async () => await connectDb());
beforeEach(async () => await deleteData());
after(async () => await closeDb());

describe('Users', () => {
  describe('register', () => {
    it('should register users', async () => {
      const res = await supertest(app).post('/api/users/register').send({
        email: 'test',
        username: 'test',
        password: 'test',
      });

      const user = (await User.findOne()) as User;
      expect(res.status).eq(201);
      expect(res.body.payload).deep.eq(user.toJson());
      expect(res.body.error).null;
      const usersCount = await User.count();
      expect(usersCount).eq(1);
      // expect(users).lengthOf(1);
    });

    it('should not register taken username', async () => {
      const userData = { email: 'email', username: 'username', password: 'password' };
      let user = await User.register(userData);

      const res = await supertest(app).post('/api/users/register').send(userData);

      expect(res.status).eq(400);
      expect(res.body.error).eq('Username taken');
    });

    it('should reject missing data', async () => {
      const res = await supertest(app).post('/api/users/register').send({});

      expect(res.status).eq(400);
      expect(res.body.error).eq('Missing email, username, password');
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      let user = await User.register('email', 'username', 'password');

      const res = await supertest(app).post('/api/users/login').send({
        username: user.username,
        password: 'password',
      });
      user = (await User.rawGetOne()) as User;

      expect(res.status).eq(200);
      expect(res.body.payload).deep.eq(user.toJson());
      expect(res.body.payload.lastLoginAt).not.null;
      expect(res.body.error).null;
      const cookies = extractCookies(res.headers);
      expect(cookies.accessToken).exist;
      expect(cookies.accessToken.flags.HttpOnly).true;
      expect(cookies.accessToken.flags.SameSite).eq('Strict');
      expect(cookies.refreshToken).exist;
      expect(cookies.refreshToken.value).eq(user.refreshToken);
      expect(cookies.refreshToken.flags.HttpOnly).true;
      expect(cookies.refreshToken.flags.SameSite).eq('Strict');
    });

    it('should not login user with bad username', async () => {
      await User.register('email', 'username', 'password');

      const res = await supertest(app).post('/api/users/login').send({
        username: 'bad',
        password: 'password',
      });

      expect(res.status).eq(400);
      expect(res.body.payload).null;
      expect(res.body.error).eq('No user found');
    });

    it('should not login user with bad password', async () => {
      await User.register('email', 'username', 'password');

      const res = await supertest(app).post('/api/users/login').send({
        username: 'username',
        password: 'bad',
      });

      expect(res.status).eq(400);
      expect(res.body.payload).null;
      expect(res.body.error).eq('Wrong password');
    });
  });

  describe('refresh-token', () => {
    it('should refresh token', async () => {
      const user = await User.register('email', 'username', 'password');
      const token = 'test refresh token';
      user.refreshToken = token;
      await user.save();

      const res = await supertest(app)
        .get('/api/users/refresh-token')
        .set('Cookie', `refreshToken=${token}`);

      expect(res.status).eq(200);
      expect(res.body.payload).eq(null);
      expect(res.body.error).eq(null);
    });

    it('should not refresh token with bad token', async () => {
      const user = await User.register('email', 'username', 'password');
      const token = 'test refresh token';
      user.refreshToken = token;
      await user.save();

      const res = await supertest(app)
        .get('/api/users/refresh-token')
        .set('Cookie', `refreshToken=bad`);

      expect(res.status).eq(401);
      expect(res.body.payload).eq(null);
      expect(res.body.error).eq('Invalid refresh token');
    });
  });

  describe('current', () => {
    it('should get current user', async () => {
      const user = await User.register('email', 'username', 'password');
      const token = getAccessToken(user);

      const res = await supertest(app)
        .get('/api/users/current')
        .set('Cookie', `accessToken=${token}`);

      expect(res.status).eq(200);
      expect(res.body.payload).eq(user.id);
      expect(res.body.error).eq(null);
    });

    it('should not get current user', async () => {
      const res = await supertest(app).get('/api/users/current');

      expect(res.status).eq(401);
      expect(res.body).deep.eq({});
    });
  });
});