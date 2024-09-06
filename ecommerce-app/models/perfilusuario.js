const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const User = require('./user');

const PerfilUsuario = sequelize.define('PerfilUsuario', {
  resumenProfesional: DataTypes.TEXT,
  ubicacion: DataTypes.STRING,
  fechaUltimaActualizacion: DataTypes.DATE,
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Referencia al modelo User
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'perfil_usuarios',
});

module.exports = PerfilUsuario;
