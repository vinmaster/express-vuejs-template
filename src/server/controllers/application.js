const Logger = require(`${process.cwd()}/src/server/lib/logger`);
const Helper = require(`${process.cwd()}/src/server/lib/helper`);

module.exports = class ApplicationController {
  static index(req, res, _next) {
    const bundlePath = process.env.NODE_ENV === 'production' ? res.locals.webpack_asset('main').js : 'js/bundle.js';
    res.render('index', { title: 'Express vuejs template', scripts: [bundlePath] });
  }

  static config(req, res, _next) {
    Helper.renderSuccessJson(res, { config: 'test' });
  }

  static error(req, res, next) {
    Logger.error('THIS IS TEST ERROR');
    next(new Error('This is an error and it should be logged to the console'));
    // Helper.renderBadJson(res, 'test')
  }

  static test(req, res, _next) {
    Logger.info('THIS IS TEST INFO');
    res.send('test');
  }
};
