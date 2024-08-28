// models/Industria.js
import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Industria = sequelize.define('Industria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // asegura que los nombres de industria sean únicos
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true // permite que la descripción sea opcional
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true // si decides añadir un código identificador único
    }
}, {
    tableName: 'industrias'
});

export default Industria;
