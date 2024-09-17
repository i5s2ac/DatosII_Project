const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Empresa = require('./Empresa');
const User = require('./user');

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
    type: DataTypes.TEXT, // Almacenado como TEXT en la BD, se manejará como valores separados por comas
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? rawValue.split(',') : []; // Al leer, devuelve como array
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('tags', value.join(',')); // Al guardar, almacena como string
      } else {
        throw new Error('Los tags deben ser un arreglo.'); // Error de validación
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

  // Nuevos campos agregados
  Funciones_Requerimiento: {
    type: DataTypes.STRING,
    allowNull: true, // Puedes ajustar esto según tus necesidades
  },
  Estudios_Requerimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Experiencia_Requerimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Conocimientos_Requerimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Competencias__Requerimiento: { // Nota: Verifica si el doble guion bajo es intencional
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'ofertas_empleos',
});

module.exports = OfertaEmpleo;
