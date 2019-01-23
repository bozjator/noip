module.exports = (sequelize, DataTypes) => {
  var IpChangeLog = sequelize.define("IpChangeLog", {
    compName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipOld: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipNew: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeStamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false
    }
  });

  return IpChangeLog;
};
