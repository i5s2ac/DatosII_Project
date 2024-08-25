const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Usuario = require('./Usuario');

const Notificacion = sequelize.define('Notificacion', {
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fechaEnvio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('leída', 'no leída'),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'notificaciones',
});

module.exports = Notificacion;
