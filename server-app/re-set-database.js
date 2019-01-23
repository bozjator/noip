const db = require("./db/models");
const prompt = require("prompt-sync")();

function resetDatabase() {
  db.sequelize
    .sync({ force: true }) // Force set to true, will drop all tables and create new ones.
    .then(() => {
      console.log("CONNECTED to the database and synchronized tables.");
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err);
    });
}

const answer = prompt(
  `This will create or override database tables? [write yes to continue] `
);

if (answer === "yes") resetDatabase();
