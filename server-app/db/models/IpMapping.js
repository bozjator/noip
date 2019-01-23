module.exports = (sequelize, DataTypes) => {
  var IpMapping = sequelize.define("IpMapping", {
    compName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeStamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false
    }
  });

  return IpMapping;
};
