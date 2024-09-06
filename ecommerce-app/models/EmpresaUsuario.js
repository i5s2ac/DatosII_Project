// models/EmpresaUsuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');
const Empresa = require('./Empresa');
const User = require('./user');
const Rol = require('./rol');

const EmpresaUsuario = sequelize.define('EmpresaUsuario', {
    empresaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Empresa,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    rolId: {
        type: DataTypes.INTEGER,
        references: {
            model: Rol, // Verifica que el modelo Rol esté correctamente definido
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresa_usuario',
});

module.exports = EmpresaUsuario;
