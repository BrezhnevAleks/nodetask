const express = require("express");
const Sequelize = require("sequelize");
const crypto = require("crypto");
const app = express();
const userController = require("./controllers/userController.js");

const sequelize = new Sequelize("testdb", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});
//sequelize.authenticate().then(function (errors) {
// console.log(errors);
//});

sequelize
  .sync()
  .then(() => {
    app.listen(3000, function () {
      console.log("Сервер ожидает подключения...");
    });
  })
  .catch((err) => console.log(err));

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: Sequelize.STRING,
//   dob: {
//     type: Sequelize.DATEONLY,
//     allowNull: false,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

function cipher(pass) {
  let cipher = crypto.createCipher("aes-256-ecb", "secretword");
  return cipher.update(pass, "utf8", "hex") + cipher.final("hex");
}

function decipher(pass) {
  let decipher = crypto.createDecipher("aes-256-ecb", "secretword");
  return decipher.update(pass, "hex", "utf8") + decipher.final("utf8");
}

let pass = "password";
console.log("Пароль:" + pass);
let cript = cipher(pass);
console.log("Зашифрованый пароль:" + cript);

let decript = decipher(cript);
console.log("Расшифрованый пароль:" + decript);

app.set("view engine", "hbs");

const userRouter = express.Router();

userRouter.use("/create", userController.addUser);
userRouter.use("/", userController.getUsers);
userRouter.use("/delete", userController.deleteUser);
userRouter.use("/login", userController.loginUser);
userRouter.use("/update", userController.updateUser);
app.use("/users", userRouter);

// app.post("/create", function (request, response) {
//   User.create({
//     name: "Tom",
//     email: "example@mail.ru",
//     dob: new Date(),
//     password: cipher("supersecretpassword"),
//   }).then((res) => {
//     console.log(res);
//   });
//   response.end();
// });

// app.post("/delete", function (request, response) {
//   User.destroy({
//     where: {
//       name: "Tom",
//     },
//   }).then((res) => {
//     console.log(res);
//   });
//   response.end();
// });

// app.post("/update", function (request, response) {
//   User.update(
//     { email: "newexample@mail.ru" },
//     {
//       where: {
//         name: "Tom",
//       },
//     }
//   ).then((res) => {
//     console.log(res);
//   });
//   response.end();
// });

// app.post("/login", function (request, response) {
//   const login = "Tom";
//   const password = "supersecretpassword";
//   let logged;
//   User.findOne({ where: { name: login } }).then((user) => {
//     console.log(typeof decipher(user.password));
//     console.log(typeof password);
//     if (decipher(user.password) == password) {
//       logged = "success";
//     } else logged = "failure";

//     console.log("Результат входа: " + logged);
//     response.send(logged);
//   });
// });

// app.get("/", function (request, response) {
//   User.findAll({ raw: true })
//     .then((users) => {
//       console.log(users);
//     })
//     .catch((err) => console.log(err));
//   response.end();
// });
