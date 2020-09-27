import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { Utility } from './utility';

const { createLogger, transports, format } = winston;
const { combine, colorize, simple, json } = format;

// const logFormat = winston.format.printf(info => {
//   return `[${new Date().toLocaleString()}]${info.level}: ${Utility.stringify(info.message)}`;
// });

morgan.token('id', req => {
  // Also assigns request id
  req.id = uuidv4();
  return req.id;
});

const options = {
  file: {
    level: 'info',
    filename: `logs/${Utility.env}.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: combine(simple(), json()),
  },
  console: {
    level: 'debug',
    // format: combine(colorize(), logFormat),
    format: combine(colorize(), simple()),
  },
};

const logTransports: any[] = [new transports.File(options.file)];
if (Utility.env !== 'test') logTransports.push(new transports.Console(options.console));

export let Logger: winston.Logger;

export function registerLogger(app) {
  // Create a new Winston Logger
  Logger = createLogger({
    format: combine(
      format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
      })
    ),
    transports: logTransports,
    exitOnError: false, // Do not exit on handled exceptions
  });

  Logger.stream = {
    // @ts-ignore
    write(message) {
      Logger.info(message);
    },
  };

  app.use(
    // @ts-ignore
    morgan(':date[iso] :id :method :url :status :response-time :total-time', {
      stream: Logger.stream,
    })
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
