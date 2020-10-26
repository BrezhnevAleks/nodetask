//const Sequelize = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function cipher(pass) {
  let cipher = crypto.createCipher("aes-256-ecb", "secretword");
  return cipher.update(pass, "utf8", "hex") + cipher.final("hex");
}

function decipher(pass) {
  let decipher = crypto.createDecipher("aes-256-ecb", "secretword");
  return decipher.update(pass, "hex", "utf8") + decipher.final("utf8");
}

function validateEmail(email) {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const User = require("../models").User;

exports.addUser = function (request, response) {
  const { name, email, dob, password } = request.body;
  if (validateEmail(email) && password.length > 6) {
    User.create({
      name: name,
      email: email,
      dob: dob,
      password: cipher(password),
    }).then((res) => {
      console.log(res);
    });
  } else {
    console.log("Invalid email or too short password");
    response.sendStatus(400);
  }

  response.end();
};

exports.getUsers = function (request, response) {
  User.findAll({ raw: true })
    .then((users) => {
      console.log(users);
    })
    .catch((err) => console.log(err));
  response.end();
};

exports.deleteUser = function (request, response) {
  const { id } = request.body;
  User.destroy({
    where: {
      id: id,
    },
  }).then((res) => {
    console.log(res);
    console.log("Пользователь с id " + id + " был удалён");
  });
  response.end();
};

exports.updateUser = function (request, response) {
  const { name, email } = request.body;
  User.update(
    { email: email },
    {
      where: {
        name: name,
      },
    }
  ).then((res) => {
    console.log(res);
    console.log("Пользователь " + name + " email обновлён на " + email);
  });
  response.end();
};

exports.loginUser = function (request, response) {
  const { login, password } = request.body;
  let logged;
  let token;

  User.findOne({ where: { name: login } })
    .then((user) => {
      console.log(decipher(user.password));
      console.log(password);
      if (decipher(user.password) === password) {
        logged = "success";

        token = jwt.sign(
          { exp: Math.floor(Date.now() / 1000) + 60, data: user.id },
          "secret"
        );
        response.send({ token: token });
        console.log("Verification: token for user id " + user.id + " is sent");
        console.log("Результат входа: " + logged);
        console.log("Token: " + token);
      } else {
        logged = "failure";
        console.log("Verification: invalid password or login");
        response.sendStatus(406);
      }
    })
    .catch(response.sendStatus(404));
};

exports.checkToken = function (request, response) {
  const { token } = request.headers;
  console.log("Token: " + token);
  try {
    let decoded = jwt.verify(token, "secret");
    response.send(
      "Verification: user id " + decoded.data + " can access this information"
    );
  } catch (err) {
    response.sendStatus(403);
  }

  response.end();
};
