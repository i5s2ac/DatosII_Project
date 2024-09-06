// models/Educacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const PerfilUsuario = require('./perfilusuario');

const Educacion = sequelize.define('Educacion', {
    institucion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gradoObtenido: {
        type: DataTypes.STRING,
    },
    campoEstudio: {
        type: DataTypes.STRING,
    },
    fechaInicio: {
        type: DataTypes.DATE,
    },
    fechaFin: {
        type: DataTypes.DATE,
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
    tableName: 'educacion',
});

module.exports = Educacion;
