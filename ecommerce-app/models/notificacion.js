const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Usuario = require('./user');

const Notificacion = sequelize.define('Notificacion', {
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fechaEnvio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('leída', 'no leída'),
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'notificaciones',
});

module.exports = Notificacion;
