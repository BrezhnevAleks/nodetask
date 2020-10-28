const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const utils = require("../utils");

const User = require("../models").User;
const config = require("../config/config.json");

exports.createUser = async function (request, response) {
  const { name, email, dob, password } = request.body;
  {
    try {
      if (password.length > 6) {
        const user = await User.create({
          name: name,
          email: email,
          dob: dob,
          password: utils.cipher(password),
        });
        response.status(201).send(user);
      } else throw err;
    } catch (err) {
      response.status(400).send("Wrong email or too short password");
    }
  }
};

exports.getUsers = async function (request, response) {
  try {
    const users = await User.findAll({ raw: true });
    response.status(200).send(users);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.deleteUser = async function (request, response) {
  const { id } = request.body;
  try {
    const user = await User.findOne({ where: { id: id } });
    if (!user) throw err;
    else {
      await user.destroy({ where: { id: id } });
      response.status(200).send("User id " + id + " was successfully deleted");
    }
  } catch (err) {
    response.status(404).send("User id " + id + " not found");
  }
};

exports.updateUser = async function (request, response) {
  const { name, email } = request.body;
  try {
    const user = await User.findOne({ where: { name: name } });
    if (user) {
      await user.update(
        { email: email },
        {
          where: {
            name: name,
          },
        }
      );
      response
        .status(200)
        .send("User " + name + ": email updated. New email: " + email);
    } else throw err;
  } catch (err) {
    response.status(404).send("User " + name + " not found");
  }
};

exports.loginUser = async function (request, response) {
  const { login, password } = request.body;
  let logged;
  let token;
  try {
    const user = await User.findOne({ where: { name: login } });

    console.log(utils.decipher(user.password));
    console.log(password);
    if (user.password === utils.cipher(password)) {
      logged = "success";
      token = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 60, data: user.id },
        config.secret
      );
      response.send({ token: token });
      console.log("Verification: token for user id " + user.id + " is sent");
      console.log("Результат входа: " + logged);
      console.log("Token: " + token);
    } else {
      logged = "failure";
      console.log("Verification: invalid password or login");
      response.status(406).send("Invalid password or login");
    }
  } catch (err) {
    response.status(404).send("Something went wrong");
  }
};

exports.checkToken = function (request, response) {
  const { token } = request.headers;
  console.log("Token: " + token);
  try {
    let decoded = jwt.verify(token, config.secret);
    response
      .status(200)
      .send(
        "Verification: user id " + decoded.data + " can access this information"
      );
  } catch (err) {
    response.status(403).send("Something wrong with token");
  }
};
