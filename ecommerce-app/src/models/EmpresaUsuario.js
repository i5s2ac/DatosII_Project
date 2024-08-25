const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Empresa = require('./Empresa');
const User = require('./User');
const Rol = require('./ROL');

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
            model: Rol,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresa_usuario',
});

export default EmpresaUsuario;