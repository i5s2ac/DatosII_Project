import Industria from '../../models/Industria';
import sequelize from '@/lib/sequelize';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await sequelize.authenticate();
            const industrias = await Industria.findAll({
                attributes: ['id', 'nombre']
            });
            res.status(200).json(industrias);
        } catch (error) {
            console.error('Error fetching industries:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
