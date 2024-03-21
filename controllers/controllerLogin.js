const { Book, Profile, Transaction, User } = require("../models/index.js");
const formatRupiah = require("../helpers/formatRupiah.js");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class ControllerLogin {
  static async loginForm(req, res) {
    try {
      const { error } = req.query;
      res.render("loginForm", { error });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;

      let user = await User.findOne({ where: { email } });

      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) {
          req.session.userId = user.id; //set session di controller login
          req.session.role = user.role;
          return res.redirect("/");
        } else {
          const error = `Invalid Password or Email`;
          return res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = `Invalid Password or Email`;
        return res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = ControllerLogin;
