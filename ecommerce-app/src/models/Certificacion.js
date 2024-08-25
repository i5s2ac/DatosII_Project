const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const PerfilUsuario = require('./PerfilUsuario');

const Certificacion = sequelize.define('Certificacion', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizacionEmisora: DataTypes.STRING,
    fechaObtencion: DataTypes.DATE,
    descripcion: DataTypes.TEXT,
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
