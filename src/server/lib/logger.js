const winston = require('winston')

const winstonTransports = process.env.NODE_ENV === 'test' ? [] : [
  new winston.transports.Console({
    json: false,
    colorize: true
  })
]

const logger = new winston.Logger({ transports: winstonTransports })

module.exports = logger
