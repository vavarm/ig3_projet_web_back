const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const EventTag = sequelize.define(
  "EventTag",
  {
    event_id: {
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
    tableName: "EventTag",
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = EventTag
