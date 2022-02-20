import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../server/app';
import { clearData, closeDb, connectDb, extractCookies } from './test-utility';

before(async () => await connectDb());
beforeEach(async () => await clearData());
after(async () => await closeDb());

describe('app', () => {
  it('should return 200', async () => {
    const res = await supertest(app).get('/');
    expect(res.text).to.be.ok;
    expect(res.status).to.equal(200);
  });

  it('should return 200 for html path not found', async () => {
    const res = await supertest(app).get('/unknown');
    expect(res.text).to.be.ok;
    expect(res.status).to.equal(200);
  });

  it('should return 404 for api path not found', async () => {
    const res = await supertest(app)
      .get('/api/badpath')
      .set('x-requested-with', 'XmlHttpRequest');
    expect(res.body.error).to.equal('Not found');
    expect(res.status).to.equal(404);
  });
});
