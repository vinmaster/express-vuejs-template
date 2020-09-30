import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, refreshToken, setAccessToken, setRefreshToken } from '../lib/authentication';
import { Logger } from '../lib/logger';
import { Utility } from '../lib/utility';
import { User } from '../models/user';

const usersRoutes = express.Router();

usersRoutes.post(
  '/register',
  [
    body('email')
      .notEmpty()
      .withMessage('is required')
      .isEmail()
      .normalizeEmail()
      .withMessage('is not valid'),
    body('username').notEmpty().withMessage('is required'),
    body('password').notEmpty().withMessage('is required'),
  ],
  async (req, res) => {
    // console.log('accessToken', req.signedCookies.accessToken);

    // const required = ['email', 'username', 'password'];
    // const errors = required.reduce((acc: string[], key) => {
    //   if (!req.body[key]) acc.push(key);
    //   return acc;
    // }, []);
    // if (errors.length !== 0) throw Utility.createError('Missing ' + errors.join(', '));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw Utility.createError(
        errors
          .array()
          .map(e => `${Utility.capitalize(e.param)} ${e.msg.toLowerCase()}`)
          .join(', ')
      );
    }
    const { email, username, password } = req.body;
    const user = await User.register(email, username, password);
    Utility.apiRender(res, user.toJson(), 201);
  }
);

usersRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.login(username, password);

  setAccessToken(req, res, user);
  await setRefreshToken(req, res, user);
  Logger.info('User logged in', user);
  Utility.apiRender(res, user.toJson());
});

usersRoutes.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send();
});

usersRoutes.get('/refresh-token', async (req, res) => {
  const user = await refreshToken(req, res);
  Utility.apiRender(res, user.toJson());
});

usersRoutes.get('/current', authenticate(), async (req, res) => {
  const userId = req.user!['id'];
  const user = await User.findOne(userId);
  if (!user) throw Utility.createError('No such user');
  Utility.apiRender(res, user.toJson());
});

export default usersRoutes;
