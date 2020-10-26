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
    })
      .then(response.sendStatus(201))
      .catch(response.sendStatus(400).send("Something went terribly wrong"));
  } else {
    response.status(400).send("Invalid email or too short password");
  }
};

exports.getUsers = function (request, response) {
  User.findAll({ raw: true })
    .then((users) => {
      response.send(users);
    })
    .catch((err) => console.log(err));
};

exports.deleteUser = function (request, response) {
  const { id } = request.body;
  User.findOne({ where: { id: id } }).then((user) => {
    user
      ? user
          .destroy({
            where: {
              id: id,
            },
          })
          .then(
            response.status(200).send("Пользователь с id " + id + " был удалён")
          )
      : response.status(404).send("Пользователь с id " + id + " не найден");
  });
};

exports.updateUser = function (request, response) {
  const { name, email } = request.body;
  User.findOne({ where: { name: name } }).then((user) => {
    user
      ? user
          .update(
            { email: email },
            {
              where: {
                name: name,
              },
            }
          )
          .then(
            response
              .status(200)
              .send("Пользователь " + name + ": email обновлён на " + email)
          )
      : response.status(404).send("Пользователь не найден");
  });
};

exports.loginUser = function (request, response) {
  const { login, password } = request.body;
  let logged;
  let token;
  try {
    User.findOne({ where: { name: login } }).then((user) => {
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
        response.status(406).send("Invalid password or login");
      }
    });
  } catch (err) {
    response.status(404).send("Something went wrong");
  }
};

exports.checkToken = function (request, response) {
  const { token } = request.headers;
  console.log("Token: " + token);
  try {
    let decoded = jwt.verify(token, "secret");
    response
      .status(200)
      .send(
        "Verification: user id " + decoded.data + " can access this information"
      );
  } catch (err) {
    response.sendStatus(403).send("Something wrong with token");
  }
  response.end();
};
