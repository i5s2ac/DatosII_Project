const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');

const Educacion = sequelize.define('Educacion', {
    institucion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gradoObtenido: {
        type: DataTypes.STRING,
    },
    campoEstudio: {
        type: DataTypes.STRING,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,  // Cambiado de DATE a DATEONLY
    },
    fechaFin: {
        type: DataTypes.DATEONLY,  // Cambiado de DATE a DATEONLY
    },
    usuarioid: {
        type: DataTypes.INTEGER,
        allowNull: false,  // No permite valores nulos
        references: {
            model: 'Users',  // Nombre del modelo referenciado (ajusta si el nombre del modelo es diferente)
            key: 'id',       // Clave foránea que hace referencia al campo 'id' del modelo referenciado
        }
    },
}, {
    tableName: 'educacion',
});

module.exports = Educacion;

