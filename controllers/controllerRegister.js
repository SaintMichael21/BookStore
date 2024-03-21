const { Book, Profile, Transaction, User } = require("../models/index.js");
const formatRupiah = require("../helpers/formatRupiah.js");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class ControllerRegister {
    static async registerForm(req, res) {
        try {
        let { errors } = req.query;
         if(errors){
            errors = errors.split(",");
         }
          res.render("registerForm", {errors});
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      }
    
      static async postRegister(req, res) {
        try {
          const { email, password, role } = req.body;
          await User.create({ email, password, role });
          res.redirect("/login");
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let msg = error.errors.map((err) => {
                  return err.message;
                });
                // res.send(msg);
                res.redirect(`/register?errors=${msg}`);
              } else {
                console.log(error);
                res.send(error);
              }
        }
      }
}

module.exports = ControllerRegister;
