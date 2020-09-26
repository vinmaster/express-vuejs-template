import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import ms from 'ms';
import { authenticate } from '../lib/authentication';
import { notFoundHandler } from '../lib/error-handlers';
import { Utility } from '../lib/utility';

const apiRoutes = express.Router();
apiRoutes.get('/test', (req, res) => {
  res.send({ test: 1 });
});
apiRoutes.post('/users/register', (req, res) => {
  // console.log('accessToken', req.signedCookies.accessToken);
  res.status(201).json({ test: 1 });
});
apiRoutes.post('/users/login', async (req, res) => {
  const signOptions: jsonwebtoken.SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
  };
  const secret = process.env.JWT_SECRET as string;
  const jwt = jsonwebtoken.sign({ sub: 1 }, secret, signOptions);
  res
    .cookie('accessToken', jwt, {
      // signed: true,
      secure: Utility.env == 'production' && req.secure,
      sameSite: 'strict',
      httpOnly: true,
      maxAge: ms(process.env.ACCESS_TOKEN_EXPIRE_TIME as string),
    })
    .send({ success: true });
});
apiRoutes.post('/users/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).send();
});
apiRoutes.get('/users/current', authenticate(), (req, res) => {
  console.log('current', req.user);
  res.json('ok');
});

// app.use(notFoundHandler);
apiRoutes.use(notFoundHandler);

export default apiRoutes;
