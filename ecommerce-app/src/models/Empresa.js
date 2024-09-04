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
            model: 'industrias',  // Nombre de la tabla referenciada
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresas',
});

// Sincroniza el modelo con la base de datos
sequelize.sync()
    .then(() => {
        console.log('Tabla "empresas" sincronizada correctamente.');
    })
    .catch(error => {
        console.error('Error al sincronizar la tabla "empresas":', error);
    });

module.exports = Empresa;
