const Sequelize = require("sequelize");
const sequelize = new Sequelize("testdb", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});
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
  User.create({
    name: "Tom",
    email: "example@mail.ru",
    dob: new Date(),
    password: cipher("supersecretpassword"),
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
  User.destroy({
    where: {
      name: "Tom",
    },
  }).then((res) => {
    console.log(res);
  });
  response.end();
};

exports.updateUser = function (request, response) {
  User.update(
    { email: "newexample@mail.ru" },
    {
      where: {
        name: "Tom",
      },
    }
  ).then((res) => {
    console.log(res);
  });
  response.end();
};

exports.loginUser = function (request, response) {
  const login = "Tom";
  const password = "supersecretpassword";
  let logged;
  User.findOne({ where: { name: login } }).then((user) => {
    console.log(typeof decipher(user.password));
    console.log(typeof password);
    if (decipher(user.password) == password) {
      logged = "success";
    } else logged = "failure";

    console.log("Результат входа: " + logged);
    response.send(logged);
  });
};
