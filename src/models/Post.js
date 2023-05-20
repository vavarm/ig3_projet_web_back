const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Post",
    freezeTableName: true,
    timestamps: true,
  }
)

module.exports = Post
