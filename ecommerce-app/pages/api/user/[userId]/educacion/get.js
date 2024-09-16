
import sequelize from '../../../../../src/lib/sequelize';
import Educacion from '../../../../../models/Educacion'; // Ajusta el path según tu estructura de modelos
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
            // Autentica la conexión a la base de datos
            await sequelize.authenticate();

            // Consulta todas las educaciones relacionadas al usuario autenticado
            const educacion = await Educacion.findAll({
                where: { usuarioid: decoded.id }
            });

            // Si no se encuentra ninguna educación
            if (educacion.length === 0) {
                return res.status(404).json({ success: false, message: 'No education records found for this user' });
            }

            // Devuelve las educaciones encontradas
            res.status(200).json(educacion);
        } catch (error) {
            console.error('Error fetching education records:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
