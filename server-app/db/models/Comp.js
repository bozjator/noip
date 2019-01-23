module.exports = (sequelize, DataTypes) => {
  var Comp = sequelize.define("Comp", {
    compName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    secretKeyHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  return Comp;
};
