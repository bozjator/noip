const db = require("../db/models");
const bcrypt = require("bcryptjs");

const authClientsCache = {};

async function makeClientAuthentication(compName, secretKey) {
  const existingComp = await db.Comp.findOne({
    where: { compName }
  });

  if (!existingComp) return false;

  const secretKeyMatches = bcrypt.compareSync(
    secretKey,
    existingComp.secretKeyHash
  );

  if (secretKeyMatches) {
    authClientsCache[compName] = { secretKey };
    return true;
  } else {
    return false;
  }
}

function checkClientAuthentication(compName, secretKey) {
  // First check if computer authentication is cached.
  const cachedComputerAuth = authClientsCache[compName];
  if (cachedComputerAuth) {
    if (cachedComputerAuth.secretKey === secretKey) return true;
    else return false;
  }

  // If computer was not yet authenticated.
  return makeClientAuthentication(compName, secretKey);
}

module.exports = {
  checkClientAuthentication
};
