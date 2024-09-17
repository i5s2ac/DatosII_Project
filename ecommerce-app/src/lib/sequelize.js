const { Sequelize } = require('sequelize');
require('dotenv').config();  // Cargar las variables de entorno

const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nombre de la base de datos
    process.env.DB_USER,      // Usuario de la base de datos
    process.env.DB_PASSWORD,  // Contraseña de la base de datos
    {
        host: process.env.DB_HOST,  // Host (localhost o servidor remoto)
        dialect: 'mysql',           // Dialecto de la base de datos (MySQL)
        port: 3306,                 // Puerto
        logging: console.log,       // Log de las consultas SQL (puedes desactivarlo usando false)
    }
);

// Probar la conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
    })
    .catch((err) => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = sequelize;  // Exporta correctamente el objeto sequelize
