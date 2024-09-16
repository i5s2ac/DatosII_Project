import sequelize from '../../../../../src/lib/sequelize';
import Educacion from '../../../../../models/Educacion'; // Asegúrate de ajustar la importación según tu modelo
import { verifyToken } from '../../../../../src/lib/auth';

export default async function createEducacion(req, res) {
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

            const { institucion, gradoObtenido, campoEstudio, fechaInicio, fechaFin } = req.body;

            // Crear nueva educación
            const nuevaEducacion = await Educacion.create({
                institucion,
                gradoObtenido,
                campoEstudio,
                fechaInicio,
                fechaFin,
                usuarioid: decoded.id
            });

            res.status(201).json({ success: true, educacion: nuevaEducacion });
        } catch (error) {
            console.error('Error creating education:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}