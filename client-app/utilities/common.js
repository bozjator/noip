const fs = require("fs");

function checkFolder(path) {
  const pathParts = path.split("/");
  let pathToCheck = "";
  pathParts.forEach(element => {
    if (pathToCheck.length != 0) pathToCheck += "/";
    pathToCheck += element;
    if (!fs.existsSync(pathToCheck)) {
      fs.mkdirSync(pathToCheck);
    }
  });
}

function getFormattedDateTime(formatForFileName = false) {
  const twoDigit = num => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  const d = new Date();
  const day = twoDigit(d.getDate());
  const month = twoDigit(d.getMonth() + 1);
  const hour = twoDigit(d.getHours());
  const min = twoDigit(d.getMinutes());
  const sec = twoDigit(d.getSeconds());
  if (formatForFileName)
    return `${day}-${month}-${d.getFullYear()}_${hour}-${min}-${sec}`;
  else return `${day}.${month}.${d.getFullYear()} ${hour}:${min}:${sec}`;
}

module.exports = {
  getFormattedDateTime,
  checkFolder
};
