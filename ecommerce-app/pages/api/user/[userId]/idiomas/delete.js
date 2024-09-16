import sequelize from '../../../../../src/lib/sequelize';
import Idioma from '../../../../../models/Idioma';
import { verifyToken } from '../../../../../src/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Language ID is required' });
        }

        try {
            await sequelize.authenticate();

            // Encuentra el idioma por su ID y el ID del usuario
            const idioma = await Idioma.findOne({
                where: {
                    id,
                    usuarioId: decoded.id
                }
            });

            if (!idioma) {
                return res.status(404).json({ success: false, message: 'Language not found' });
            }

            // Elimina el idioma
            await idioma.destroy();

            res.status(200).json({ success: true, message: 'Language deleted successfully' });
        } catch (error) {
            console.error('Error deleting language:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
