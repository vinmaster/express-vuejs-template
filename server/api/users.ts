import express from 'express';
import { authenticate, refreshToken, setAccessToken, setRefreshToken } from '../lib/authentication';
import { Utility } from '../lib/utility';
import { User } from '../models/user';

const usersRoutes = express.Router();

usersRoutes.post('/register', async (req, res) => {
  // console.log('accessToken', req.signedCookies.accessToken);
  const required = ['email', 'username', 'password'];
  const errors = required.reduce((acc: string[], key) => {
    if (!req.body[key]) acc.push(key);
    return acc;
  }, []);
  if (errors.length !== 0) throw Utility.createError('Missing ' + errors.join(', '));
  const { email, username, password } = req.body;
  const user = await User.register(email, username, password);
  Utility.apiRender(res, user.toJson(), 201);
});

usersRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.login(username, password);

  setAccessToken(req, res, user);
  await setRefreshToken(req, res, user);
  Utility.apiRender(res, user.toJson());
});

usersRoutes.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send();
});

usersRoutes.get('/refresh-token', async (req, res) => {
  const user = await refreshToken(req, res);
  Utility.apiRender(res, null);
});

usersRoutes.get('/current', authenticate(), (req, res) => {
  const userId = req.user!['id'];
  Utility.apiRender(res, userId);
});

export default usersRoutes;
