const express = require('express');
const RateLimit = require('express-rate-limit');

const router = express.Router();
const apiRouter = express.Router();
const Logger = require(`${process.cwd()}/src/server/lib/logger`);
const Helper = require(`${process.cwd()}/src/server/lib/helper`);
const ApplicationController = require(`${process.cwd()}/src/server/controllers/application`);
const CalendarsController = require(`${process.cwd()}/src/server/controllers/calendars`);
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit requests per window
  delayMs: 0,
  skip: Helper.skipReq,
});
const passSessionUserToView = (req, res, next) => {
  const keysToPass = ['userId', 'username'];
  if (req.session && keysToPass.every(key => Object.keys(req.session).includes(key))) {
    Helper.updateObjectWithSource(res.locals, req.session, { allowed: keysToPass });
  }
  next();
};

router.use(limiter);
router.use(passSessionUserToView);

// Render home page
const homeRoutes = ['/', '/todos', '/calendars'];
router.get(homeRoutes, ApplicationController.index);
router.get('/test', ApplicationController.test);
router.get('/error', ApplicationController.error);

router.use('/api', apiRouter);
apiRouter.get('/calendars', CalendarsController.index);

// Create 404 Not Found for next middleware
apiRouter.use((req, res, next) => {
  next(Helper.createError('Not Found', 404));
});

apiRouter.use((err, req, res, _next) => {
  const {
    status, message, info, error,
  } = Helper.digestError(err);
  // Logger.error(error);
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
    status, message, error,
  } = Helper.digestError(err);
  let {
    info,
  } = Helper.digestError(err);
  // Logger.error(error);
  Logger.error(`${error.message}\n${error.stack}`);
  info = error.stack.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  info = info.replace(/ /g, '&nbsp;');
  info = info.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>');
  return res.status(status).render('error', {
    title: `${status} - ${message}`,
    status,
    message,
    info,
  });
});

module.exports = router;
