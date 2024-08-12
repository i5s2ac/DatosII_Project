const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users', // Specify the exact table name
    timestamps: true,
});

module.exports = User;
