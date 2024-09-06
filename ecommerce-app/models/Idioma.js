// models/Idioma.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Usuario = require('./user');

const Idioma = sequelize.define('Idioma', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nivelDominio: {
        type: DataTypes.ENUM('básico', 'intermedio', 'avanzado', 'experto'),
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
    tableName: 'idiomas',
});

module.exports = Idioma;
