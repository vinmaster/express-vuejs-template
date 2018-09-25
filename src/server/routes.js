const express = require('express');
const RateLimit = require('express-rate-limit');

const router = express.Router();
const apiRouter = express.Router();
const Logger = require(`${process.cwd()}/src/server/lib/logger`);
const Helper = require(`${process.cwd()}/src/server/lib/helper`);
const ApplicationController = require(`${process.cwd()}/src/server/controllers/application`);
const UsersController = require(`${process.cwd()}/src/server/controllers/users`);
const CalendarsController = require(`${process.cwd()}/src/server/controllers/calendars`);
const Models = require(`${process.cwd()}/src/server/models/index`);
const { User } = Models;
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit requests per window
  delayMs: 0,
  skip: Helper.skipReq,
});

const auth = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    const { authorization } = req.headers;
    [, token] = authorization.split(' ');
  } else {
    token = req.query.token || req.body.token;
  }
  if (!token) return next(Helper.createError('Missing token', 401));
  const decodedToken = Helper.jwtVerify(token);
  if (!decodedToken) return next(Helper.createError('Invalid token', 401));
  const user = await User.findById(decodedToken.userId);
  if (user) {
    req.user = user;
    next();
  } else {
    next(Helper.createError('Invalid token', 401));
  }
};

const optionalAuth = (req, res, next) => Helper.auth(req, res, _ => {
  // Throw away error if auth failed
  next();
});

router.use(limiter);

// Render home page
const homeRoutes = ['/', '/register', '/login', '/logout', '/todos', '/calendars'];
router.get(homeRoutes, ApplicationController.index);
router.get('/test', optionalAuth, Helper.asyncWrap(ApplicationController.test));
router.get('/error', Helper.asyncWrap(ApplicationController.error));

router.use('/api', apiRouter);
apiRouter.post('/report', Helper.asyncWrap(ApplicationController.report));
apiRouter.get('/calendars', auth, CalendarsController.index);
apiRouter.post('/users/register', Helper.asyncWrap(UsersController.register));
apiRouter.post('/users/login', Helper.asyncWrap(UsersController.login));
apiRouter.post('/users/logout', auth, Helper.asyncWrap(UsersController.logout));
apiRouter.post('/users/refresh', Helper.asyncWrap(UsersController.refresh));

// Create 404 Not Found for next middleware
apiRouter.use((req, res, next) => {
  next(Helper.createError('Not Found', 404));
});

apiRouter.use((err, req, res, _next) => {
  const {
    status, message, info, error,
  } = Helper.digestError(err);
  Logger.error(`${error.message}\n${error.stack}`);

  res.status(status).json({
    status,
    error: {
      message,
      info,
    },
    payload: null,
  });
});

// Unmatched routes
router.use((req, res, next) => {
  next(Helper.createError('Not Found', 404));
});
router.use((err, req, res, _next) => {
  const {
    status, message, error, info,
  } = Helper.digestError(err, { html: true });
  Logger.error(`${error.message}\n${error.stack}`);

  return res.status(status).render('error', {
    title: `${status} - ${message}`,
    status,
    message,
    info,
  });
});

module.exports = router;
