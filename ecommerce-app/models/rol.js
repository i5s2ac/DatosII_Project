const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');

const Rol = sequelize.define('Rol', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Agrega `unique` aquí
  },
  descripcion: DataTypes.TEXT,
}, {
  tableName: 'roles',
});

module.exports = Rol;
