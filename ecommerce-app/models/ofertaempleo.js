const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Empresa = require('./Empresa');
const User = require('./User');

const OfertaEmpleo = sequelize.define('OfertaEmpleo', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [0, 255],
    },
  },
  ubicacion: DataTypes.STRING,
  salario: DataTypes.DECIMAL,
  fechaPublicacion: DataTypes.DATE,
  fechaCierre: DataTypes.DATE,
  empresaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Empresa,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
  },
  estatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Activo',
  },
  tags: {
    type: DataTypes.TEXT, // Storing as TEXT in DB, will be handled as comma-separated values
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? rawValue.split(',') : []; // On read, return as array
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('tags', value.join(',')); // On save, store as string
      } else {
        throw new Error('Los tags deben ser un arreglo.'); // Validation error
      }
    },
  },
  modalidad: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Presencial',
  },
  tipoTrabajo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Tiempo Completo',
  },
}, {
  tableName: 'ofertas_empleos',
});

module.exports = OfertaEmpleo;
