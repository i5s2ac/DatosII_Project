const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Empresa = require('./Empresa');

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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'ofertas_empleos',
});

export default OfertaEmpleo;