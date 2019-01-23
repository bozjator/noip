const winston = require("winston");
const common = require("./common");

let logger;

const LOGGER_LABELS = Object.freeze({
  INFO: "INFO",
  ERR: "ERR"
});

function init(pathForLogFiles) {
  common.checkFolder(pathForLogFiles);
  logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: "DD.MM.YYYY HH:mm:ss"
      }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: `${pathForLogFiles}/info.log`,
        level: "info"
      }),
      new winston.transports.File({
        filename: `${pathForLogFiles}/error.log`,
        level: "error"
      }),
      new winston.transports.File({
        filename: `${pathForLogFiles}/combined.log`
      })
    ]
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple()
      })
    );
  }
}

function info(message, label = LOGGER_LABELS.INFO) {
  logger.log({
    level: "info",
    label,
    message
  });
}

function error(message, label = LOGGER_LABELS.ERR) {
  logger.log({
    level: "error",
    label,
    message
  });
}

module.exports = { labels: LOGGER_LABELS, info, error, init };
