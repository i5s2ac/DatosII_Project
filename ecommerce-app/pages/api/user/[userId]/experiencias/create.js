import sequelize from '../../../../../src/lib/sequelize';
import Experiencia from '../../../../../models/ExperienciaLaboral'; // Asegúrate de que el nombre del modelo coincida con la exportación
import { verifyToken } from '../../../../../src/lib/auth';

export default async function createExperiencias(req, res) {
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
            await sequelize.authenticate();

            const { titulo_puesto, empresa, ubicacion, fecha_inicio, fecha_fin, descripcion } = req.body;

            // Crear nueva experiencia laboral
            const nuevaExperiencia = await Experiencia.create({
                usuarioid: decoded.id,
                titulo_puesto,
                empresa,
                ubicacion,
                fecha_inicio,
                fecha_fin,
                descripcion
            });

            res.status(201).json({ success: true, experiencia: nuevaExperiencia });
        } catch (error) {
            console.error('Error creating experience:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
