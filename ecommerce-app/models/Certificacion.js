// models/Certificacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const PerfilUsuario = require('./perfilusuario');

const Certificacion = sequelize.define('Certificacion', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizacionEmisora: {
        type: DataTypes.STRING,
    },
    fechaObtencion: {
        type: DataTypes.DATE,
    },
    descripcion: {
        type: DataTypes.TEXT,
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
    tableName: 'certificaciones',
});

module.exports = Certificacion;
