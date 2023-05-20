const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Tag = sequelize.define(
  "Tag",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        len: [1, 10],
      }
    },
  },
  {
    tableName: "Tag",
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = Tag
