const { Book, Profile, Transaction, User } = require("../models/index.js");
const formatRupiah = require("../helpers/formatRupiah.js");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class ControllerBooks {
  static async renderBooks(req, res) {
    try {
      console.log(req.session);
      const { userId } = req.session;
      let id;
      if (userId === undefined) {
        id = undefined;
      } else {
        id = await User.findByPk({ id });
      }
      console.log(id);
      res.render("books", { id });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = ControllerBooks;
