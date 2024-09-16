
import sequelize from '../../../../../src/lib/sequelize';
import Certificacion from '../../../../../models/Certificacion'; // Ajusta el path según tu estructura de modelos
import { verifyToken } from '../../../../../src/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        const { id, nombre, organizacionEmisora, fechaObtencion, descripcion } = req.body; // Asegúrate que el body tiene el ID y los campos a modificar

        if (!id) {
            return res.status(400).json({ success: false, message: 'No certification ID provided' });
        }

        try {
            await sequelize.authenticate();

            // Busca la certificación por su ID y usuario
            const certificacion = await Certificacion.findOne({
                where: {
                    id: id,
                    usuarioid: decoded.id // Asegúrate de que el usuario propietario es el que está autenticado
                }
            });

            if (!certificacion) {
                return res.status(404).json({ success: false, message: 'Certification not found' });
            }

            // Actualiza los campos
            certificacion.nombre = nombre || certificacion.nombre;
            certificacion.organizacionEmisora = organizacionEmisora || certificacion.organizacionEmisora;
            certificacion.fechaObtencion = fechaObtencion || certificacion.fechaObtencion;
            certificacion.descripcion = descripcion || certificacion.descripcion;

            // Guarda los cambios
            await certificacion.save();

            res.status(200).json({ success: true, message: 'Certification updated successfully', certificacion });
        } catch (error) {
            console.error('Error updating certification:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
