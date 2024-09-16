import sequelize from '../../../../../src/lib/sequelize';
import Educacion from '../../../../../models/Educacion'; // Ajusta el path según tu estructura de modelos
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

        const { id } = req.query; // Usa 'id' para la consulta en la URL

        if (!id) {
            return res.status(400).json({ success: false, message: 'Education ID is required' });
        }

        try {
            await sequelize.authenticate();

            // Encuentra el registro de educación por su ID y el ID del usuario
            const educacion = await Educacion.findOne({
                where: {
                    id,
                    usuarioid: decoded.id
                }
            });

            if (!educacion) {
                return res.status(404).json({ success: false, message: 'Education record not found' });
            }

            // Elimina el registro de educación
            await educacion.destroy();

            res.status(200).json({ success: true, message: 'Education record deleted successfully' });
        } catch (error) {
            console.error('Error deleting education record:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
