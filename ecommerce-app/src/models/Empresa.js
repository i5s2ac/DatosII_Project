const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

const Empresa = sequelize.define('Empresa', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    email: DataTypes.STRING,
    sitioWeb: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    industriaId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Industrias',  // Nombre correcto de la tabla
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresas',
});

module.exports = Empresa;
