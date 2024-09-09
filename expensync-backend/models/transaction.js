module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Transaction.associate = function (models) {
    Transaction.belongsTo(models.User);
  };

  return Transaction;
};
