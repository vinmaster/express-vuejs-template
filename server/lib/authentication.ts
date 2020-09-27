import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import ms from 'ms';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { User } from '../models/user';
import { Utility } from './utility';

const saltRounds = 10;

export function registerAuthentication(app) {
  const strategyOptions: passportJwt.StrategyOptions = {
    // jwtFromRequest: req => req.signedCookies.accessToken,
    jwtFromRequest: req => req.cookies.accessToken,
    secretOrKey: process.env.JWT_SECRET,
  };

  const verifyCallback: passportJwt.VerifyCallback = (payload, done) => {
    done(null, { id: payload.sub });
    // find user success
    // done(null, { userId: payload.sub });

    // not found
    // done(null, false);

    // error
    // done(err, false);
  };

  app.use(passport.initialize());
  passport.use(new passportJwt.Strategy(strategyOptions, verifyCallback));
}

export function authenticate() {
  return passport.authenticate('jwt', { session: false });
}

export async function hashPassword(password): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, passwordHash): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}

export function setAccessToken(req: Request, res: Response, user: User) {
  const jwt = getAccessToken(user);
  res.cookie('accessToken', jwt, {
    // signed: true,
    secure: Utility.env == 'production' && req.secure,
    sameSite: 'strict',
    httpOnly: true,
    maxAge: ms(process.env.ACCESS_TOKEN_EXPIRE_TIME as string),
  });
}

export function getAccessToken(user: User): string {
  const signOptions: jsonwebtoken.SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
  };
  const secret = process.env.JWT_SECRET as string;
  const jwt = jsonwebtoken.sign({ sub: user.id }, secret, signOptions);
  return jwt;
}

export async function setRefreshToken(req: Request, res: Response, user: User) {
  if (!user.refreshToken) {
    user.refreshToken = generateRefreshToken();
    await user.save();
  }
  res.cookie('refreshToken', user.refreshToken, {
    // signed: true,
    secure: Utility.env == 'production' && req.secure,
    sameSite: 'strict',
    httpOnly: true,
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRE_TIME as string),
  });
}

export function generateRefreshToken() {
  // Generate random hex with 32 length
  return crypto.randomBytes(16).toString('hex');
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw Utility.createError('No refresh token', 401);

  const user = await User.findOne({ refreshToken });
  if (!user) throw Utility.createError('Invalid refresh token', 401);
  setAccessToken(req, res, user);

  return user;
}
