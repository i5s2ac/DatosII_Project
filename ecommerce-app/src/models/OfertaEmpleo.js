const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Empresa = require('./Empresa');
const User = require('./User');  // Asumiendo que tienes un modelo de Usuario

const OfertaEmpleo = sequelize.define('OfertaEmpleo', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: DataTypes.TEXT,
    ubicacion: DataTypes.STRING,
    salario: DataTypes.DECIMAL,
    fechaPublicacion: DataTypes.DATE,
    fechaCierre: DataTypes.DATE,
    empresaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Empresa,
            key: 'id',
        },
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,  // Referencia al modelo de usuario
            key: 'id',
        },
        allowNull: false,
    }
}, {
    tableName: 'ofertas_empleos',
});

module.exports = OfertaEmpleo;
