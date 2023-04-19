const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const PostTag = sequelize.define(
  "PostTag",
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "PostTag",
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = PostTag
