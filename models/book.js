"use strict";
const { Model, fn, col } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.hasMany(models.Transaction);
    }

    status(stock) {
      if (stock === 0) {
        return `Unavailable`;
      } else {
        return `Available`;
      }
    }

    static;
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title tidak bisa kosong",
          },
          notNull: {
            args: true,
            msg: `Title tidak bisa kosong`,
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Author tidak bisa kosong",
          },
          notNull: {
            args: true,
            msg: `Author tidak bisa kosong`,
          },
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Category tidak bisa kosong",
          },
          notNull: {
            args: true,
            msg: `Category tidak bisa kosong`,
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Stock tidak bisa kosong",
          },
          notNull: {
            args: true,
            msg: `Stock tidak bisa kosong`,
          },
          min: {
            args: 1,
            msg: `Stock minimal 1`,
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Price tidak bisa kosong",
          },
          notNull: {
            args: true,
            msg: `Price tidak bisa kosong`,
          },
        },
      },
      synopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Synopsis tidak bisa kosong",
          },
          notNull: {
            args: true,
            msg: `Synopsis tidak bisa kosong`,
          },
        },
      },
      imageUrl: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );

  return Book;
};
