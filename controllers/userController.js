const Sequelize = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

function validateEmail(email) {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
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
  if (validateEmail(email) && password.length > 6) {
    User.create({
      name: name,
      email: email,
      dob: dob,
      password: cipher(password),
    }).then((res) => {
      console.log(res);
    });
  }
  console.log("Invalid email or too short password");

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
    console.log("Пользователь " + name + " email обновлён на " + email);
  });
  response.end();
};

exports.loginUser = function (request, response) {
  const { login } = request.body;
  const { password } = request.body;
  let logged;
  let token;
  User.findOne({ where: { name: login } }).then((user) => {
    console.log(decipher(user.password));
    console.log(password);
    if (decipher(user.password) == password) {
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
    }

    response.end();
  });
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
    response.send("Verification: invalid token");
  }

  response.end();
};

// exports.checkToken = function (request, response) {
//   const { Authorization } = request.headers;
//   console.log("Token: " + Authorization);
//   try {
//     let decoded = jwt.verify(Authorization, "secret");
//     response.send(
//       "Verification: user id " + decoded.data + " can access this information"
//     );
//   } catch (err) {
//     console.log("Verification: invalid token");
//   }

//   response.end();
// };
