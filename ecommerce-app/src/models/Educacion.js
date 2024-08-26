const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const PerfilUsuario = require('./PerfilUsuario');

const Educacion = sequelize.define('Educacion', {
    institucion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gradoObtenido: DataTypes.STRING,
    campoEstudio: DataTypes.STRING,
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE,
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
