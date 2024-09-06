// models/HistorialAplicaciones.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const User = require('./user');
const OfertaEmpleo = require('./ofertaempleo');

const HistorialAplicaciones = sequelize.define('HistorialAplicaciones', {
    fechaAplicacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estadoAplicacion: {
        type: DataTypes.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ofertaEmpleoId: {
        type: DataTypes.INTEGER,
        references: {
            model: OfertaEmpleo,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'historial_aplicaciones',
});

module.exports = HistorialAplicaciones;
