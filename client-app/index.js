const os = require("os");
const rp = require("request-promise");
const log = require("./utilities/logger");
log.init(`APP_DATA`);

const noIpServerUrl = process.env.NOIP_SERVER || "";
const computerName = process.env.CLIENT_NAME || os.hostname();
const ipUpdateCheckInterval = 1000 * 60 * 1;

const requestOptions = {
  method: "POST",
  uri: "",
  body: {
    compName: computerName,
    secretKey: "custum-client-secret-key"
  },
  headers: {
    "User-Agent": "NoIp-Client-App"
  },
  json: true // Automatically parses the JSON string in the response
};

function makeIPUpdateCheckRequest() {
  const url = `${noIpServerUrl}/ip-update-check`;
  requestOptions.url = url;
  requestOptions.resolveWithFullResponse = false;

  rp(requestOptions)
    .then(function(response) {
      if (response.changed)
        log.info(`IP was updated. New ip: ${response.newIp}`);
    })
    .catch(function(err) {
      log.error(`Error making ip check request: ${err}, ${err.stack}`);
    });
}

async function makeRegistrationRequestCall() {
  const url = `${noIpServerUrl}/register`;
  requestOptions.url = url;
  requestOptions.resolveWithFullResponse = true; // Give me full response, not only response body.
  log.info(`Sending request for registration.`);
  const response = await rp(requestOptions);
  if (response && response.statusCode === 200) {
    if (response.success)
      log.info(`Your computer name was registered successfuly.`);
    else
      log.info(`Your computer name was not registered: ${response.body.msg}`);
  } else {
    log.error(
      `Error making registration request, status code: ${
        response.statusCode
      } - ${response}`
    );
  }
}

async function main() {
  log.info(`NoIp Client app started with computer name: ${computerName}`);
  if (noIpServerUrl === "") {
    log.error(
      "You need to setup environment variable NOIP_SERVER which is url of your noip server."
    );
    return;
  }
  await makeRegistrationRequestCall();
  makeIPUpdateCheckRequest();
  setInterval(makeIPUpdateCheckRequest, ipUpdateCheckInterval);
}

main();
