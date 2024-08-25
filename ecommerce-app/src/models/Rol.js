const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');


const Rol = sequelize.define('Rol', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: DataTypes.TEXT,
}, {
    timestamps: true,
    tableName: 'roles',
});

export default Rol;