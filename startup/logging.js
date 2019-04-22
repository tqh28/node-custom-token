const winston = require('winston');
require('winston-daily-rotate-file');

module.exports = () => {
  const fileTransport = new winston.transports.DailyRotateFile({
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint()
    )
  });
  const consoleTransport = new winston.transports.Console({
    format: winston.format.simple()
  });

  winston.add(fileTransport);
  winston.add(consoleTransport);
};
