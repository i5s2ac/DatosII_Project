
import sequelize from '../../../../../src/lib/sequelize';
import Certificacion from '../../../../../models/Certificacion'; // Ajusta el path según tu estructura de modelos
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
            // Autentica la conexión con la base de datos
            await sequelize.authenticate();

            // Encuentra todas las certificaciones que pertenezcan al usuario autenticado (decoded.id)
            const certificaciones = await Certificacion.findAll({
                where: { usuarioid: decoded.id }
            });

            // Responde con éxito y devuelve las certificaciones
            res.status(200).json(certificaciones);
        } catch (error) {
            console.error('Error fetching certificaciones:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        // Si el método HTTP no es GET, responde con un error 405 (Method Not Allowed)
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
