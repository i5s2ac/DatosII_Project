const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Usuario = require("./user");

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
  tableName: 'Skills',
  timestamps: true,  // Si quieres que Sequelize maneje las fechas de creación y actualización
});

module.exports = Skill;
