const { DataTypes } = require('sequelize');
const sequelize = require('../src/lib/sequelize');

const ExperienciaLaboral = sequelize.define('ExperienciaLaboral', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  // Define esta columna como la clave primaria
        allowNull: false,  // No permite valores nulos
    },
    usuarioid: {
        type: DataTypes.INTEGER,
        allowNull: false,  // No permite valores nulos
        references: {
            model: 'Users',  // Nombre del modelo referenciado (ajusta si el nombre del modelo es diferente)
            key: 'id',       // Clave foránea que hace referencia al campo 'id' del modelo referenciado
        }
    },
    titulo_puesto: {
        type: DataTypes.STRING,
        allowNull: false,  // No permite valores nulos
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false,  // No permite valores nulos
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,  // Permite valores nulos
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true,  // Permite valores nulos
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true,  // Permite valores nulos
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,  // Permite valores nulos
    }
}, {
    timestamps: true,       // Agrega campos createdAt y updatedAt
    tableName: 'experiencia_laboral',  // Nombre de la tabla en la base de datos
});

module.exports = ExperienciaLaboral;
