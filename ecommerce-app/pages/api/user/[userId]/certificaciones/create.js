import sequelize from '../../../../../src/lib/sequelize';
import Certificacion from '../../../../../models/Certificacion';
import { verifyToken } from '../../../../../src/lib/auth';

export default async function createCertificaciones(req, res) {
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        try {
            await sequelize.authenticate(); // Verifica si la conexión se establece correctamente

            const { nombre, organizacionEmisora, fechaObtencion, descripcion } = req.body;

            // Verifica que todos los datos necesarios estén presentes
            if (!nombre || !decoded.id) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            // Crear nueva certificación
            const nuevaCertificacion = await Certificacion.create({
                nombre,
                organizacionEmisora,
                fechaObtencion,
                descripcion,
                usuarioid: decoded.id
            });
            console.log('Request body:', req.body);

            res.status(201).json({ success: true, certificacion: nuevaCertificacion });
        } catch (error) {
            console.error('Error creating certification:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
