const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const PerfilUsuario = require('./PerfilUsuario');

const Skill = sequelize.define('Skill', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nivelDominio: {
        type: DataTypes.ENUM('básico', 'intermedio', 'avanzado', 'experto'),
        allowNull: false,
    },
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
    tableName: 'Skills',
});

module.exports = Skill;
