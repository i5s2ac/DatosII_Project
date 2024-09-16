
import sequelize from '../../../../../src/lib/sequelize';
import Experiencia from '../../../../../models/ExperienciaLaboral'; // Ajusta el path según tu estructura de modelos
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

        try {
            await sequelize.authenticate();

            const { id, titulo_puesto, empresa, ubicacion, fecha_inicio, fecha_fin, descripcion } = req.body;

            // Busca la experiencia laboral por su ID y usuario autenticado
            const experiencia = await Experiencia.findOne({
                where: { id, usuarioid: decoded.id }
            });

            if (!experiencia) {
                return res.status(404).json({ success: false, message: 'Work experience not found' });
            }

            // Actualiza los campos que se hayan enviado en el cuerpo de la solicitud
            experiencia.titulo_puesto = titulo_puesto || experiencia.titulo_puesto;
            experiencia.empresa = empresa || experiencia.empresa;
            experiencia.ubicacion = ubicacion || experiencia.ubicacion;
            experiencia.fecha_inicio = fecha_inicio || experiencia.fecha_inicio;
            experiencia.fecha_fin = fecha_fin || experiencia.fecha_fin;
            experiencia.descripcion = descripcion || experiencia.descripcion;

            // Guarda los cambios en la base de datos
            await experiencia.save();

            res.status(200).json({ success: true, message: 'Work experience updated successfully', experiencia });
        } catch (error) {
            console.error('Error updating work experience:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
