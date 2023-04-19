const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const LessonTag = sequelize.define(
  "LessonTag",
  {
    lesson_id: {
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
    tableName: "LessonTag",
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = LessonTag
