const express = require("express");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (reg, file, cb) => {
    cb(null, "Images");
  },
  filename: (reg, file, cb) => {
    console.log(file);
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
const ControllerRegister = require("../controllers/controllerRegister.js");
const ControllerLogin = require("../controllers/controllerLogin.js");
const ControllerLogout = require("../controllers/controllerLogout.js");
const ControllerBooks = require("../controllers/controllerBooks.js");
const ControllerAdmin = require("../controllers/controllerAdmin.js");

function isLogin(req, res, next) {
  // untuk ngecek ada yang login atau engga pas mau akses /register atau /login
  if (!req.session.userId) {
    next();
  } else if (req.session.role === "admin") {
    res.redirect(`/admin`);
  } else if (req.session.role === "member") {
    res.redirect(`/books`);
  }
}

function isAdmin(req, res, next) {
  if (req.session.role !== "admin") {
    res.redirect("/login");
  } else {
    next();
  }
}

function isMember(req, res, next) {
  if (req.session.role !== "member") {
    res.redirect("/logout");
  } else {
    next();
  }
}

// get register
router.get("/register", isLogin, ControllerRegister.registerForm);

// post register
router.post("/register", isLogin, ControllerRegister.postRegister);

// get login
router.get("/login", isLogin, ControllerLogin.loginForm);

// post login
router.post("/login", isLogin, ControllerLogin.postLogin);

//get logout
router.get("/logout", ControllerLogout.logOut);

router.get("/", (req, res) => {
  res.redirect("/books");
});

//books
//default
router.get("/books", isMember, ControllerBooks.renderBooks);
//get profile
router.get("/profiles", isMember, ControllerBooks.renderCreateProfile);

//get profile
router.post("/profiles", isMember, ControllerBooks.handleCreateProfile);

//get profile
router.get("/profiles/edit", isMember, ControllerBooks.renderEditProfile);

//get profile
router.post("/profiles/edit/:id", isMember, ControllerBooks.handleEditProfile);

//get seeDetail - halaman detail buku - bisa beli
router.get("/books/:id", isMember, ControllerBooks.renderDetailBook);
router.post("/books/:id", isMember, ControllerBooks.handleDetailBook);

//get transaction - halaman transaksi user - read doang - id user
router.get("/transaction/:id", isMember, ControllerBooks.renderTransactions);

// Admin
router.get("/admin/books", isAdmin, ControllerAdmin.renderBooksAdmin);

//get admin - halaman admin bisa nambahin, delete, update

//nambahin
router.get("/admin/books/add", isAdmin, ControllerAdmin.renderAddBooksAdmin);
router.post(
  "/admin/add/",
  upload.single("imageUrl"),
  ControllerAdmin.handleAddBooksAdmin
);

//delete
router.get(
  "/admin/books/delete/:id",
  isAdmin,
  ControllerAdmin.renderDeleteBooksAdmin
);

// //update
router.get(
  "/admin/books/edit/:id",
  isAdmin,
  ControllerAdmin.renderEditBooksAdmin
);
router.post(
  "/admin/books/edit/:id",
  isAdmin,
  upload.single("imageUrl"),
  ControllerAdmin.handleEditBooksAdmin
);

module.exports = router;
