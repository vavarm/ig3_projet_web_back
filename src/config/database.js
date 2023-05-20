const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOSTNAME,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
)

module.exports = sequelize
