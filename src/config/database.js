const { Sequelize } = require("sequelize")

console.log("database.js: " + process.env.DATABASE_URL)

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false,
  }
)



module.exports = sequelize
