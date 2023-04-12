const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Tag = sequelize.define(
  "Tag",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "Tag",
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = Tag
