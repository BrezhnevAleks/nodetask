const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.post("/create", userController.createUser);
userRouter.delete("/delete", userController.deleteUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/update", userController.updateUser);
userRouter.get("/check", userController.checkToken);
userRouter.get("/", userController.getUsers);

module.exports = userRouter;
