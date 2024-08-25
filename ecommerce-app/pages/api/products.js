import Product from '@/models/CandidatoOferta';
import sequelize from '@/lib/sequelize';

export default async function handler(req, res) {
    const { userId } = req.query;

    try {
        await sequelize.sync();
        
        await sequelize.authenticate();

        const products = await Product.findAll({
            where: { userId: userId }
        });

        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ success: false, message: 'No products found for this user' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
