import { DataTypes } from 'sequelize';
import sequelize from '../src/lib/sequelize';
import OfertaEmpleo from './OfertaEmpleo'; // Importación directa permitida

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

// Asociaciones directas que no generan ciclos
User.hasMany(OfertaEmpleo, { foreignKey: 'userId', as: 'ofertasEmpleo' });

export default User;
