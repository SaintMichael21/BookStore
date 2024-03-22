const { Book, Profile, Transaction, User } = require("../models/index.js");
const formatRupiah = require("../helpers/formatRupiah.js");
const bcrypt = require("bcryptjs");
const { Op, EagerLoadingError } = require("sequelize");
const { logOut } = require("./controllerLogout.js");

class ControllerAdmin {
  static async renderBooksAdmin(req, res) {
    try {
      // console.log(`masuk`);
      // const{ userId, role}  = req.session
      const { search } = req.query;

      let books = await Book.findAll({
        order: [["id", "ASC"]],
        where: {
          title: {
            [Op.iLike]: `%${search ? search : ""}%`,
          },
        },
      });

      res.render("homeAdmin", { books, formatRupiah });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderAddBooksAdmin(req, res) {
    try {
      let { errors } = req.query;

      if (errors) {
        errors = errors.split(",");
      }

      res.render("addBooksAdmin", { errors });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleAddBooksAdmin(req, res) {
    try {
      if (!req.file) {
        throw {
          name: `SequelizeValidationError`,
          errors: [{ message: `Gambar invalid` }],
        };
      }
      const image = req.file.path;
      const { title, author, category, stock, price, synopsis } = req.body;
      await Book.create({
        title,
        author,
        category,
        stock,
        price,
        synopsis,
        imageUrl: image,
      });
      res.redirect("/admin/books");
    } catch (error) {
      if ((error.name = "SequelizeValidationError")) {
        let msg = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/admin/books/add?errors=${msg}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async renderEditBooksAdmin(req, res) {
    try {
      const id = req.params.id;
      let { errors } = req.query;

      if (errors) {
        errors = errors.split(",");
      }

      // console.log(id);
      let bookId = await Book.findAll({
        where: {
          id,
        },
      });
      // console.log(bookId, `=============================`);
      // console.log(artId[0].dataValues, `=============================);
      let book = bookId[0].dataValues;
      // console.log(book);
      res.render("editBooksAdmin", { book, errors });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleEditBooksAdmin(req, res) {
    try {
      const id = req.params.id;
      if (!req.file) {
        throw {
          name: `SequelizeValidationError`,
          errors: [{ message: `Gambar invalid` }],
        };
      }
      const imageUrl = req.file.path;
      // console.log(id);
      // console.log(req.body);
      const { title, author, category, stock, price, synopsis } = req.body;

      await Book.update(
        {
          title,
          author,
          category,
          stock,
          price,
          synopsis,
          imageUrl,
        },
        {
          where: {
            id,
          },
        }
      );

      res.redirect("/admin/books");
    } catch (error) {
      if ((error.name = "SequelizeValidationError")) {
        const { id } = req.params;
        let msg = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/admin/books/edit/${id}?errors=${msg}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async renderDeleteBooksAdmin(req, res) {
    try {
      const id = req.params.id;
      // console.log(id);
      await Book.destroy({
        where: {
          id: id,
        },
      });

      res.redirect("/admin/books");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = ControllerAdmin;
