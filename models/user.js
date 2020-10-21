const Sequelize = require("sequelize");
const sequelize = new Sequelize("testdb", "postgres", "fusion", {
  dialect: "postgres",
  host: "localhost",
});
module.exports = sequelize.define("user", {
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
