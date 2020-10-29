const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter");

const app = express();

app.listen(3000, function () {
  console.log("Сервер запущен...");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/users", userRouter);
