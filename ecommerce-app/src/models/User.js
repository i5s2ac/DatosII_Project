import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'users', // Asegúrate de que coincide con el nombre de la tabla en la base de datos
});

export default User;
