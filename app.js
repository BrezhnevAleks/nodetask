const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const userController = require("./controllers/userController.js");
const bodyParser = require("body-parser");

const sequelize = new Sequelize("testdb", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000, function () {
      console.log("Сервер ожидает подключения...");
    });
  })
  .catch((err) => console.log(err));

const userRouter = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

userRouter.use("/create", userController.addUser);
userRouter.use("/delete", userController.deleteUser);
userRouter.use("/login", userController.loginUser);
userRouter.use("/update", userController.updateUser);
userRouter.use("/check", userController.checkToken);
userRouter.use("/", userController.getUsers);

app.use("/users", userRouter);
