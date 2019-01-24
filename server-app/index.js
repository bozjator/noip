const helmet = require("helmet");
const express = require("express");
const requestIp = require("request-ip");
const log = require("./utilities/logger");
const common = require("./utilities/common");
log.init(`APP_DATA/logs_${common.getFormattedDateTime(true)}`);

const isDevelopment = ["development", "qa"].includes(process.env.NODE_ENV);
const port = process.env.PORT || 3000;
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestIp.mw());

// Error handling middleware.
app.use(function(err, req, res, next) {
  log.error(`${err.message}: ${err.stack}`);
  // Error stack should be returned only in development mode.
  const errStackToReturn = isDevelopment ? err.stack : "";
  res.status(err.status || 500);
  res.json({
    error: {
      timestamp: common.getFormattedDateTime(),
      message: err.message,
      errorStack: errStackToReturn
    }
  });
});

app.use(require("./routes"));

function startServer() {
  const server = app.listen(port, "127.0.0.1", () => {
    var host = server.address().address;
    var port = server.address().port;
    log.info(`Listening on https://${host}:${port}`);
    log.info(`App started in environment: ${process.env.NODE_ENV}`);
  });
}

function main() {
  log.info(`NoIp Server is starting...`);
  startServer();
}

main();
