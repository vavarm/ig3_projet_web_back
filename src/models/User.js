const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const User = sequelize.define(
  "User",
  {
    mail_address: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        in: [0, 1, 2],
      },
    },
    suscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "User",
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = User
