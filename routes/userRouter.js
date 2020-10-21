const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.post("/create", userController.addUser);
userRouter.delete("/delete", userController.deleteUser);
userRouter.get("/login", userController.loginUser);
userRouter.post("/update", userController.updateUser);
userRouter.get("/", userController.getUsers);

module.exports = userRouter;
