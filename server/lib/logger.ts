import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { Utility } from './utility';

const { createLogger, transports, format } = winston;

// const logFormat = winston.format.printf(info => {
//   return `[${new Date().toLocaleString()}]${info.level}: ${Utility.stringify(info.message)}`;
// });

morgan.token('id', req => {
  // Also assigns request id
  req.id = uuidv4();
  return req.id;
});

const metaString = meta => {
  // You can format the splat yourself
  const splat = meta[Symbol.for('splat')];
  if (splat && splat.length) {
    return splat.length === 1 ? JSON.stringify(splat[0]) : JSON.stringify(splat);
  }
  return '';
};

const options = {
  file: {
    level: 'info',
    filename: `logs/${Utility.env}.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine(format.json()),
  },
  console: {
    level: 'debug',
    // format: combine(colorize(), logFormat),
    format: format.combine(
      format.colorize(),
      format.printf(
        ({ timestamp, level, message, label = '', ...meta }) =>
          `[${timestamp}] ${level} ${message} ${metaString(meta)}`
      )
    ),
  },
};

const logTransports: any[] = [new transports.File(options.file)];
if (Utility.env !== 'test') logTransports.push(new transports.Console(options.console));

export let Logger: winston.Logger;

export function registerLogger(app) {
  // Create a new Winston Logger
  Logger = createLogger({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
      }),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
    ),
    transports: logTransports,
    exitOnError: false, // Do not exit on handled exceptions
  });

  Logger.stream = {
    // @ts-ignore
    write(message: string) {
      const regex = /(\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+)/;
      const found = regex.exec(message);
      if (found) {
        const [_, timestamp, id, method, url, status, responseTime, totalTime] = found;
        const request = { timestamp, id, method, url, status, responseTime, totalTime };
        Logger.info('REQUEST', { type: 'REQUEST', ...request });
      } else {
        Logger.info(message.substring(0, message.lastIndexOf('\n')), { type: 'REQUEST' });
      }
    },
  };

  app.use(
    // @ts-ignore
    morgan(':date[iso] :id :method :url :status :response-time :total-time', {
      stream: Logger.stream,
    })
    // morgan((tokens, req, res) => {
    //   return {
    //     id: req.id,
    //     time: tokens['date'](req, res, 'iso'),
    //     method: tokens['method'](req, res),
    //     url: tokens['url'](req, res),
    //   };
    // })
  );
}

// import pino from 'pino';
// import PinoHttp from 'pino-http';
// import { v4 as uuidv4 } from 'uuid';
// import { Utility } from './utility';

// export let Logger: pino.Logger;

// export let RequestLogger: PinoHttp.HttpLogger;

// export function registerLogger(app) {
//   Logger = pino({ prettyPrint: { translateTime: 'yyyy-mm-dd HH:MM:ss.l o' } });

//   RequestLogger = PinoHttp({
//     logger: Logger,
//     genReqId: function (req) {
//       return uuidv4();
//     },
//     serializers: {
//       req(req) {
//         return Utility.getObjectSlice(req, ['id', 'method', 'url', 'remoteAddress']);
//       },
//       res(res) {
//         return Utility.getObjectSlice(res, ['statusCode']);
//       },
//     },
//   });

//   app.use(RequestLogger);
// }
