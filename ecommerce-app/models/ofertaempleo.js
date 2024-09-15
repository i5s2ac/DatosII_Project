const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Empresa = require('./Empresa');
const User = require('./User');  // Asegúrate de tener este modelo importado

const OfertaEmpleo = sequelize.define('OfertaEmpleo', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: DataTypes.TEXT,
  ubicacion: DataTypes.STRING,
  salario: DataTypes.DECIMAL,
  fechaPublicacion: DataTypes.DATE,
  fechaCierre: DataTypes.DATE,
  empresaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Empresa, // Referencia al modelo Empresa
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {  // Nueva columna para hacer referencia al creador de la oferta
    type: DataTypes.INTEGER,
    references: {
      model: User,  // Referencia al modelo de User
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,  // Asegúrate de que no sea nulo
  },
  estatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Activo',  // Valor por defecto
  },
}, {
  tableName: 'ofertas_empleos',
});

module.exports = OfertaEmpleo;
