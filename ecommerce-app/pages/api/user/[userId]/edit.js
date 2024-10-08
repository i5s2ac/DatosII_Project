import sequelize from '@/lib/sequelize';
import User from '../../../../models/user';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        try {
            await sequelize.authenticate();

            // Verificar si el usuario coincide con el token
            const { userId } = req.query;
            if (parseInt(userId) !== decoded.id) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email', 'telefono'] });

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
