const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Empresa = require('./Empresa');  // Asegúrate de que la ruta y nombre del archivo son correctos
const User = require('./User');
const Rol = require('./Rol');

const EmpresaUsuario = sequelize.define('EmpresaUsuario', {
    empresaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Empresa,  // Aquí debe estar el modelo correcto
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,  // Aquí debe estar el modelo correcto
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    rolId: {
        type: DataTypes.INTEGER,
        references: {
            model: Rol,  // Aquí debe estar el modelo correcto
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresa_usuario',
});

module.exports = EmpresaUsuario;
