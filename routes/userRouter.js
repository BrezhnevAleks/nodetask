const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.use("/create", userController.addUser);
userRouter.use("/", userController.getUsers);
userRouter.use("/delete", userController.deleteUser);
userRouter.use("/login", userController.loginUser);
userRouter.use("/update", userController.updateUser);

module.exports = userRouter;
