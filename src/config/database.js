const { Sequelize } = require("sequelize")

const username = process.env.DB_USERNAME || "varm"
const password = process.env.DB_PASSWORD || ""
const host = process.env.DB_HOSTNAME || "localhost"
const database = process.env.DB_NAME || "projetweb"
const port = process.env.DB_PORT || 5432

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "postgres",
  logging: false,
})

console.log("Database connection established")

module.exports = sequelize
