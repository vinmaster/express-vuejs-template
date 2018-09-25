/* eslint-env mocha */

const app = require(`${process.cwd()}/src/server`);
const SpecHelper = require(`${process.cwd()}/test/spec-helper`);
const Models = require(`${process.cwd()}/src/server/models/index`);
const { User } = Models;
const chai = require('chai');
const request = require('supertest');

const { expect } = chai;

describe('users controller', () => {
  before(() => SpecHelper.dropDatabase());
  afterEach(() => SpecHelper.dropDatabase());

  describe('POST /api/users/register', () => {
    it('should return 200', () => request(app)
      .post('/api/users/register')
      .send({
        username: 'newuser',
        password: 'password',
        passwordConfirmation: 'password',
      })
      .then(async res => {
        expect(res.statusCode).to.equal(200);
        const users = await User.findAll();
        expect(users.length).to.equal(1);
      }));

    it('should return 400 for bad request', () => request(app)
      .post('/api/users/register')
      .then(res => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.error.message).to.equal('Missing username, password, passwordConfirmation');
      }));
  });

  describe('POST /api/users/login', () => {
    it('should return 200', async () => {
      const newUser = await User.create({
        username: 'newuser',
        password: 'password',
      });
      return request(app)
        .post('/api/users/login')
        .send({
          username: newUser.username,
          password: newUser.password,
        })
        .then(async res => {
          expect(res.statusCode).to.equal(200);
          const users = await User.findAll();
          expect(users.length).to.equal(1);
          expect(users[0].username).to.equal(newUser.username);
        });
    });
  });

  describe('POST /api/users/logout', () => {
    it('should return 200', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          password: 'password',
          passwordConfirmation: 'password',
        });
      const { token, refreshToken } = response.body.payload;
      return request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${token}`)
        .then(async res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.payload).to.equal('Logged out');
          const users = await User.findAll();
          expect(users[0].refresh).to.not.equal(refreshToken);
        });
    });
  });

  describe('POST /api/users/refresh', () => {
    it('should return 200', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          password: 'password',
          passwordConfirmation: 'password',
        });
      const { refreshToken } = response.body.payload;
      return request(app)
        .post('/api/users/refresh')
        .send({
          refreshToken,
        })
        .then(async res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.payload.token).to.exist;
          expect(res.body.payload.refreshToken).to.equal(refreshToken);
        });
    });
  });
});
