// models/Empresa.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');

const Empresa = sequelize.define('Empresa', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    telefono: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    sitioWeb: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    industriaId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Industrias',  // Nombre correcto de la tabla referenciada
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresas',
});

module.exports = Empresa;
