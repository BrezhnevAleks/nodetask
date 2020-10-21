const Sequelize = require("sequelize");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const sequelize = new Sequelize("testdb", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});

function cipher(pass) {
  let cipher = crypto.createCipher("aes-256-ecb", "secretword");
  return cipher.update(pass, "utf8", "hex") + cipher.final("hex");
}

function decipher(pass) {
  let decipher = crypto.createDecipher("aes-256-ecb", "secretword");
  return decipher.update(pass, "hex", "utf8") + decipher.final("utf8");
}

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: Sequelize.STRING,
  dob: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

exports.addUser = function (request, response) {
  const { name } = request.body;
  const { email } = request.body;
  const { dob } = request.body;
  const { password } = request.body;

  User.create({
    name: name,
    email: email,
    dob: dob,
    password: cipher(password),
  }).then((res) => {
    console.log(res);
  });
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
  const { name } = request.body;
  const { email } = request.body;
  User.update(
    { email: email },
    {
      where: {
        name: name,
      },
    }
  ).then((res) => {
    console.log(res);
  });
  response.end();
};

exports.loginUser = function (request, response) {
  const { login } = request.body;
  const { password } = request.body;
  let logged;
  User.findOne({ where: { name: login } }).then((user) => {
    //console.log(typeof decipher(user.password));
    //console.log(typeof password);
    if (decipher(user.password) == password) {
      logged = "success";
    } else logged = "failure";

    console.log("Результат входа: " + logged);
    response.send(logged);
  });
};
