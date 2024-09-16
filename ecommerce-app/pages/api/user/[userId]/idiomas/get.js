
import sequelize from '../../../../../src/lib/sequelize';
import Idioma from '../../../../../models/Idioma';
import { verifyToken } from '../../../../../src/lib/auth';

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

            // Consulta todos los idiomas del usuario autenticado
            const idiomas = await Idioma.findAll({
                where: { usuarioId: decoded.id }
            });

            if (idiomas.length === 0) {
                return res.status(404).json({ success: false, message: 'No languages found for this user' });
            }

            res.status(200).json(idiomas);
        } catch (error) {
            console.error('Error fetching idiomas:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
