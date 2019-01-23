"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.js")[env];
var db = {};

config.define = {
  // Don't add the timestamp columns to tables (updatedAt, createdAt).
  timestamps: false
};
config.query = {
  // Setting raw to true, Sequelize will not return DAO objects, but will return raw model objects.
  raw: true
};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

function getAllModels(currentDirPath) {
  fs.readdirSync(currentDirPath)
    .filter(file => {
      const isModel =
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js";

      // If it is not a model, check if it is a directory and check its content.
      if (!isModel) {
        const newDirPath = `${currentDirPath}\\${file}`;
        try {
          let isDir =
            fs.existsSync(newDirPath) && fs.lstatSync(newDirPath).isDirectory();
          if (isDir) getAllModels(newDirPath);
        } catch (err) {
          console.log("Error while checking models directory: ", err);
        }
      }

      return isModel;
    })
    .forEach(file => {
      var model = sequelize["import"](path.join(currentDirPath, file));
      db[model.name] = model;
    });
}
getAllModels(__dirname);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
