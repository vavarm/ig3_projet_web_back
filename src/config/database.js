const { Sequelize } = require("sequelize")
const dotenv = require("dotenv")

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  console.log("Loading .env file")
  const result = dotenv.config({ path: "src/.env" })
  if (result.error) {
    throw result.error
  }
}

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
