const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

const Industria = sequelize.define('Industria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'industrias',
});

module.exports = Industria;


