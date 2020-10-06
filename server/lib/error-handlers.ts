import { Request } from 'express';
import { Logger } from './logger';
import { Utility } from './utility';

export function unhandledRejectionHandler(error) {
  if (!Logger) {
    console.error(`unhandledRejection ${Utility.stringify(error)}`);
  } else {
    Logger.error(`unhandledRejection ${Utility.stringify(error)}`);
  }
  throw error;
}

export function uncaughtExceptionHandler(error) {
  if (!Logger) {
    console.error(`uncaughtException ${Utility.stringify(error)}`);
  } else {
    Logger.error(`uncaughtException ${Utility.stringify(error)}`);
  }
  throw error;
}

export function notFoundHandler(req, res, next) {
  next(Utility.createError('Not found', 404));
}

export function expressErrorHandler(err, req: Request, res, next) {
  let error = err;
  if (!(err instanceof Error)) {
    error = Utility.createError(err);
  }
  // For pino logger
  // Logger.error({ reqId: req.id }, `${error.message}\n${error.stack}`);
  Logger.error(`${error.message}\n${error.stack}`);

  const status = error.status || 500;
  let message = error.appMessage || 'Bad Request';
  if (status === 500) {
    message = 'Internal Server Error';
  }

  let stack;
  const isHtml = !req.originalUrl.startsWith('/api');
  if (['development', 'test'].includes(Utility.env)) {
    if (isHtml) {
      stack = error.stack.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      stack = stack.replace(/ /g, '&nbsp;');
      stack = stack.replace(/[a-z_-\d]+(.js|.ts):\d+:\d+/gi, '<mark>$&</mark>');
    } else {
      stack = Utility.stringify(error.stack);
    }
  }

  if (isHtml) {
    return res.status(status).render('error', {
      title: `${status} - ${message}`,
      stack,
    });
  } else {
    return res.status(status).send({
      status,
      payload: null,
      error: error.message,
      stack,
    });
  }
}
