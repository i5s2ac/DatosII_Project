import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'products'  // Asegúrate de que el nombre de la tabla es correcto
});

export default Product;
