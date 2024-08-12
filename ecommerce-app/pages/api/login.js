import sequelize from '../../lib/sequelize';
import User from '../../models/User';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            await sequelize.authenticate(); // Verifica la conexión a la base de datos

            const user = await User.findOne({ where: { email, password } });

            if (user) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error connecting to the database:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
