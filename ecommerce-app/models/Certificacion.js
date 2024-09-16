// models/Certificacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');

const Certificacion = sequelize.define('Certificacion', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizacionEmisora: {
        type: DataTypes.STRING,
    },
    fechaObtencion: {
        type: DataTypes.DATEONLY,
    },
    descripcion: {
        type: DataTypes.TEXT,
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
    tableName: 'certificaciones',
});

module.exports = Certificacion;
