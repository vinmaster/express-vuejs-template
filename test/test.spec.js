/* eslint-env mocha */

const app = require(`${process.cwd()}/src/server`);
const chai = require('chai');
const request = require('supertest');

const { expect } = chai;

describe('application controller', () => {
  describe('GET /', () => {
    it('should return 200', () => request(app)
      .get('/')
      .then(res => {
        expect(res.text).to.be.ok;
        expect(res.statusCode).to.equal(200);
      }));

    it('should return 404 for path not found', () => request(app)
      .get('/badpath')
      .then(res => {
        expect(res.body.error.message).to.equal('Not Found');
        expect(res.status).to.equal(404);
      }));
  });
});
