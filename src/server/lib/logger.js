const winston = require('winston');

const { createLogger, format, transports } = winston;
const emptyTransport = {
  log: () => {},
  on: () => {},
};

const winstonTransports = process.env.NODE_ENV === 'test' ? [emptyTransport] : [
  new transports.Console(),
];

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss ZZ' }),
    format.printf(info => `[${info.timestamp}] [${info.level}] ${info.message}`),
  ),
  transports: winstonTransports,
});
logger.stream = {
  write: (message, _encoding) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
