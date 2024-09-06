const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,  // No permite valores nulos
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  // No permite valores nulos
    unique: true,      // El valor debe ser único en la tabla
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,  // No permite valores nulos
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,  // No permite valores nulos
  },
}, {
  timestamps: true,       // Agrega campos createdAt y updatedAt
  tableName: 'users',     // Nombre de la tabla en la base de datos
});

module.exports = User;
