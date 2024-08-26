const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Industria = require('./Industria'); 

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
            model: Industria,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
    tableName: 'empresas',
});

export default Empresa;