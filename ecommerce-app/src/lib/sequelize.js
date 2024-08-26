// /lib/sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: console.log,
    }
);

// Sincronizar todos los modelos
sequelize.sync()
    .then(() => console.log('Models synchronized successfully'))
    .catch(error => console.error('Error synchronizing models:', error));

module.exports = sequelize;
