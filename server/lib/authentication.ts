import passport from 'passport';
import passportJwt from 'passport-jwt';

export function registerAuthentication(app) {
  const strategyOptions: passportJwt.StrategyOptions = {
    // jwtFromRequest: req => req.signedCookies.accessToken,
    jwtFromRequest: req => req.cookies.accessToken,
    secretOrKey: process.env.JWT_SECRET,
  };

  const verifyCallback: passportJwt.VerifyCallback = (payload, done) => {
    // find user
    done(null, { userId: 1 });

    console.log('payload', payload);
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
