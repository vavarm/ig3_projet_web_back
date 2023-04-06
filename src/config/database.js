const { Sequelize } = require("sequelize")
const dotenv = require("dotenv")

if (process.env.NODE_ENV !== "production") {
  const result = dotenv.config({ path: "src/.env" })
  if (result.error) {
    throw result.error
  }
}

const username = process.env.DB_USERNAME || "postgres"
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

module.exports = sequelize
