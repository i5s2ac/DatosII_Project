
import sequelize from '../../../../../src/lib/sequelize';
import Experiencia from '../../../../../models/ExperienciaLaboral'; // Ajusta el path según tu estructura de modelos
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

            // Consulta todas las experiencias laborales del usuario autenticado
            const experiencias = await Experiencia.findAll({
                where: { usuarioid: decoded.id }
            });

            if (experiencias.length === 0) {
                return res.status(404).json({ success: false, message: 'No work experiences found for this user' });
            }

            res.status(200).json(experiencias);
        } catch (error) {
            console.error('Error fetching work experiences:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

