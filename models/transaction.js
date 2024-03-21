"use strict";
const { Model, fn, col } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Profile);
      Transaction.belongsTo(models.Book);
    }
    static penjualan(BookId) {
      return Transaction.findAll({
        attributes: [[fn("COUNT", col("id")), "Total"]],
        where: {
          BookId,
        },
      });
    }
  }
  Transaction.init(
    {
      ProfileId: DataTypes.INTEGER,
      BookId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
