import sequelize from '@/lib/sequelize';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        try {
            await sequelize.authenticate();

            const user = await User.findByPk(decoded.id, { attributes: ['id', 'username', 'email'] });

            if (user) {
                res.status(200).json({ success: true, user });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error connecting to the database:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
