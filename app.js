const PORT = 2999;
const express = require("express");
const app = express();
const router = require("./routers/index.js");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/Images", express.static("Images"));
app.use(
  session({
    secret: "rahasia donggg", //harus ada
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true }, //untuk safe dari csrf attack
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`Surfing on -${PORT}`);
});
