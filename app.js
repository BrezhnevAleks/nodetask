const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const bodyParser = require("body-parser");

const sequelize = new Sequelize("database_development", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});

app.listen(3000, function () {
  console.log("Сервер запущен...");
});

const userRouter = require("./routes/userRouter");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/users", userRouter);
