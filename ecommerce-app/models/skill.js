const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const PerfilUsuario = require('./perfilusuario');

const Skill = sequelize.define('Skill', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivelDominio: {
    type: DataTypes.ENUM('básico', 'intermedio', 'avanzado', 'experto'),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  perfilUsuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: PerfilUsuario,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'Skills',
  timestamps: true,  // Si quieres que Sequelize maneje las fechas de creación y actualización
});

module.exports = Skill;
