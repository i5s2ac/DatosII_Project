import sequelize from '../../../../../src/lib/sequelize';
import Experiencia from '../../../../../models/ExperienciaLaboral'; // Ajusta el path según tu estructura de modelos
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
            return res.status(400).json({ success: false, message: 'Experience ID is required' });
        }

        try {
            await sequelize.authenticate();

            // Encuentra la experiencia laboral por su ID y el ID del usuario
            const experiencia = await Experiencia.findOne({
                where: {
                    id,
                    usuarioid: decoded.id
                }
            });

            if (!experiencia) {
                return res.status(404).json({ success: false, message: 'Experience not found' });
            }

            // Elimina la experiencia laboral
            await experiencia.destroy();

            res.status(200).json({ success: true, message: 'Experience deleted successfully' });
        } catch (error) {
            console.error('Error deleting work experience:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

