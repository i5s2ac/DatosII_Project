const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

const Rol = sequelize.define('Rol', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descripcion: DataTypes.TEXT,
}, {
    tableName: 'roles',
});

module.exports = Rol;
