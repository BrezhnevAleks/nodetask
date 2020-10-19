const express = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("testdb", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});
sequelize.authenticate().then(function (errors) {
  console.log(errors);
});
const app = express();

app.set("view engine", "hbs");
app.get("/", function (request, response) {
  response.render("login.hbs");
});
app.get("/create", function (request, response) {
  response.render("create.hbs");
});
app.listen(3000);
