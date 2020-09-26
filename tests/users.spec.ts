import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../server/app';

describe('Users', () => {
  describe('register', () => {
    it('should register users', async () => {
      const res = await supertest(app).post('/api/users/register').send({
        username: 'test',
        password: 'test',
      });

      console.log('body', res.body);
      expect(res.status).eq(201);
      expect(res.body).deep.eq({ test: 1 });
      expect(res.body.error).null;
      // const users = await User.all();
      // expect(users).lengthOf(1);
    });
  });
});
