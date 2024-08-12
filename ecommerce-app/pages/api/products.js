import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../../lib/sequelize';

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
}, {
    timestamps: true,
});

export default async function handler(req, res) {
    try {
        await sequelize.sync();
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
