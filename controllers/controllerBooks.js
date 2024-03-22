const { Book, Profile, Transaction, User } = require("../models/index.js");
const formatRupiah = require("../helpers/formatRupiah.js");
const bcrypt = require("bcryptjs");
const { Op, where } = require("sequelize");

class ControllerBooks {
  static async renderBooks(req, res) {
    try {
      const { userId, role } = req.session;

      let id;
      if (userId === undefined) {
        id = undefined;
      } else {
        id = await User.findByPk(userId, {
          include: {
            model: Profile,
          },
        });
      }
      let { errors } = req.query;
      //untuk baca buku
      const data = await Book.findAll({
        order: [["id", "ASC"]],
      });
      if (!id) {
        res.redirect("/login");
      } else if (!id.Profile) {
        res.redirect("/profiles");
      } else {
        const idProfile = id.Profile.id;
        const profile = id.Profile;
        res.render("books", {
          id,
          books: data,
          formatRupiah,
          idProfile,
          errors,
          profile,
        });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderCreateProfile(req, res) {
    try {
      let { errors } = req.query;
      if (errors) {
        errors = errors.split(",");
      }
      res.render("profiles", { errors });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleCreateProfile(req, res) {
    try {
      const { name, phoneNumber, address, birthDate } = req.body;
      const UserId = req.session.userId;
      await Profile.create({ name, phoneNumber, address, birthDate, UserId });
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((err) => {
          return err.message;
        });
        // res.send(msg);
        res.redirect(`/profiles?errors=${msg}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async renderEditProfile(req, res) {
    try {
      const { userId, role } = req.session;

      let { errors } = req.query;
      if (errors) {
        errors = errors.split(",");
      }
      let id = await User.findByPk(userId, {
        include: {
          model: Profile,
        },
      });

      res.render("profilesEdit", { errors, profile: id.Profile, user: id });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleEditProfile(req, res) {
    try {
      const { name, phoneNumber, address, birthDate } = req.body;
      const { id } = req.params;
      const UserId = req.session.userId;
      await Profile.update(
        { name, phoneNumber, address, birthDate, UserId },
        { where: { id } }
      );
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((err) => {
          return err.message;
        });
        // res.send(msg);
        res.redirect(`/profiles/edit?errors=${msg}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async renderDetailBook(req, res) {
    try {
      const { id } = req.params;
      let data = await Book.findByPk(id);
      let penjualan = await Transaction.penjualan(id);
      let total = penjualan[0].dataValues.Total;
      let { errors } = req.query;
      if (errors) {
        errors = errors.split(",");
      }
      res.render("detailBook", { Book: data, total, formatRupiah, errors });
    } catch (error) {
      console.log(error, 125);
      res.send(error, 125);
    }
  }

  static async handleDetailBook(req, res) {
    try {
      const { quantity } = req.body;
      const { id } = req.params;
      const { userId } = req.session;
      let profile = await Profile.findAll({
        include: {
          model: User,
          where: {
            id: userId,
          },
        },
      });

      const ProfileId = profile[0].id;

      let buku = await Book.findAll({
        where: {
          id,
        },
      });
      if (buku[0].stock - quantity < 0) {
        throw {
          name: `InvalidStock`,
          errors: `Belinya kebanyakan stoknya ga nyampe bang`,
        };
      }

      await Transaction.create({ ProfileId, BookId: id, quantity });
      await Book.decrement(
        {
          stock: quantity,
        },
        {
          where: {
            id,
          },
        }
      );
      res.redirect(`/`);
    } catch (error) {
      if (error.name === `SequelizeValidationError`) {
        const { id } = req.params;
        let msg = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/books/${id}?errors=${msg}`);
      } else if (error.name === `InvalidStock`) {
        const { id } = req.params;
        res.redirect(`/books/${id}?errors=${error.errors}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async renderTransactions(req, res) {
    try {
      const { id } = req.params;
      let datas = await Transaction.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Book,
          },
          {
            model: Profile,
            where: {
              id,
            },
          },
        ],
      });

      if (datas.length < 1) {
        const errors = `Transaksi Kosong`;
        res.redirect(`/books?errors=${errors}`);
      } else {
        const profile = datas[0].Profile;
        const book = datas[0].Book;
        res.render("transaction", { book, profile, datas, formatRupiah });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = ControllerBooks;
