const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const middleware = require("../middleware/tokenChecking.js");

userRouter.post("/create", userController.createUser);
userRouter.delete(
  "/delete",
  middleware.tokenChecking,
  userController.deleteUser
);
userRouter.post("/login", userController.loginUser);
userRouter.post("/update", middleware.tokenChecking, userController.updateUser);
userRouter.get("/", middleware.tokenChecking, userController.getUsers);

module.exports = userRouter;
