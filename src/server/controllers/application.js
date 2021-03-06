const Logger = require(`${process.cwd()}/src/server/lib/logger`);
const Helper = require(`${process.cwd()}/src/server/lib/helper`);

module.exports = class ApplicationController {
  static index(req, res, _next) {
    const bundlePath = process.env.NODE_ENV === 'production' ? res.locals.webpack_asset('main').js : 'js/bundle.js';
    res.render('index', { title: 'Express vuejs template', scripts: [bundlePath] });
  }

  static report(req, res, _next) {
    const { body } = req;
    Logger.error(`Client side error: ${body.message}\t${body.source}\n${body.stack}\n${JSON.stringify(body.events)}`);
    Helper.renderSuccessJson(res, { message: 'Reported' });
  }

  static config(req, res, _next) {
    Helper.renderSuccessJson(res, { config: 'test' });
  }

  static error(_req, _res, _next) {
    Logger.error('THIS IS TEST ERROR');
    // next(new Error('This is an error and it should be logged to the console'));
    throw Helper.createError('This is an test error');
    // Helper.renderBadJson(res, 'test')
  }

  static test(req, res, _next) {
    Logger.info('THIS IS TEST INFO');
    res.send('test');
  }
};
