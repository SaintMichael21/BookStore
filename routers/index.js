const express = require("express");
const multer = require("multer");
const images = multer({ dest: "public/images" });
const router = express.Router();
const ControllerRegister = require("../controllers/controllerRegister.js");
const ControllerLogin = require("../controllers/controllerLogin.js");
const ControllerLogout = require("../controllers/controllerLogout.js");
const ControllerBooks = require("../controllers/controllerBooks.js");
const ControllerAdmin = require("../controllers/controllerAdmin.js");

// get register
router.get("/register", ControllerRegister.registerForm);

// post register
router.post("/register", ControllerRegister.postRegister);

// get login
router.get("/login", ControllerLogin.loginForm);

// post login
router.post("/login", ControllerLogin.postLogin);

//get logout
router.get("/logout", ControllerLogout.logOut);

//default
router.get("/", (req, res) => {
  res.redirect("/books");
});

//get book - halaman buku
router.get("/books", ControllerBooks.renderBooks);

//middleware - global - user biasa
router.use(function (req, res, next) {
  // console.log(req.session);
  if (!req.session.userId) {
    const error = `Login first`;
    res.redirect(`/login?error=${error}`);
  } else if (req.session.role === "admin") {
    res.redirect(`/admin`);
  } else {
    next();
  }
});

/*
per satu routing
const coba = function (req, res, next) {
  console.log("Time : ", Date.now());
  next();
};
router.get("/authors",coba, Controller.readAuthors);
*/

//get seeDetail - halaman detail buku - bisa beli
router.get("/books/:id", ControllerBooks.renderDetailBook);

//get transaction - halaman transaksi user - read doang - id user
router.get("/transaction/:id", ControllerBooks.renderTransactions);

//middleware - global - admin
router.use(function (req, res, next) {
  // console.log(req.session);
  if (req.session.role !== "admin") {
    const error = `Kusus Admin saja`;
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

//get admin - halaman admin bisa nambahin, delete, update
router.get("/admin", ControllerAdmin.renderBooksAdmin);

//nambahin
router.get("/admin/books", ControllerAdmin.renderAddBooksAdmin);
router.post(
  "/admin/books/:id",
  images.single("imageUrl"),
  ControllerAdmin.handleAddBooksAdmin
);

//delete
router.get("/admin/books/delete/:id", ControllerAdmin.renderDeleteBooksAdmin);

//update
router.get("/admin/books/edit", ControllerAdmin.renderEditBooksAdmin);
router.post(
  "/admin/books/edit/:id",
  images.single("imageUrl"),
  ControllerAdmin.handleEditBooksAdmin
);

module.exports = router;
