const db = require("../db/models");
const bcrypt = require("bcryptjs");

// When server is running and clinet makes request for the first time (in current instance of server run),
// server needs to make a hash from received secret key and compare it with the one in database.
// If it matches, then server caches client secret into array and uses this array for furder checks of client secret.
// This way it is not cpu intens, we only make hash when request is made for the first time (in current instance of server run).

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
