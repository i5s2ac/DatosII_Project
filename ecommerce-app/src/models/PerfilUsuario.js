const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const User = require('./User');

const PerfilUsuario = sequelize.define('PerfilUsuario', {
    resumenProfesional: DataTypes.TEXT,
    ubicacion: DataTypes.STRING,
    fechaUltimaActualizacion: DataTypes.DATE,
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'perfil_usuarios',
});

module.exports = PerfilUsuario;
