const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const UserEvent = sequelize.define(
    'UserEvent',
    {
        user_mail_address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        tableName: 'UserEvent',
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = UserEvent