import sequelize from '../../../../../src/lib/sequelize';
import Certificacion from '../../../../../models/Certificacion'; // Ajusta el path según tu estructura de modelos
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

        // Extrae el ID de la certificación del query parameter
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'No certification ID provided' });
        }

        try {
            await sequelize.authenticate();

            // Encuentra la certificación por su ID y el ID del usuario
            const certificacion = await Certificacion.findOne({
                where: {
                    id,
                    usuarioid: decoded.id
                }
            });

            if (!certificacion) {
                return res.status(404).json({ success: false, message: 'Certification not found' });
            }

            // Elimina la certificación
            await certificacion.destroy();

            res.status(200).json({ success: true, message: 'Certification deleted successfully' });
        } catch (error) {
            console.error('Error deleting certification:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
