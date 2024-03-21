const { Book, Profile, Transaction, User } = require("../models/index.js");
const formatRupiah = require("../helpers/formatRupiah.js");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class ControllerLogout {
  static async logOut(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = ControllerLogout;
