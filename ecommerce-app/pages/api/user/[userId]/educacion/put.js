// C:\Users\Paco\Documents\Github\DatosII_Project\ecommerce-app\pages\api\user\[userId]\educacion\put.js
import sequelize from '../../../../../src/lib/sequelize';
import Educacion from '../../../../../models/Educacion'; // Ajusta el path según tu estructura de modelos
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
            // Autentica la conexión a la base de datos
            await sequelize.authenticate();

            // Recoge el ID de la educación que se va a actualizar desde el body de la solicitud
            const { id, institucion, gradoObtenido, campoEstudio, fechaInicio, fechaFin } = req.body;

            // Encuentra la educación por ID y el usuario autenticado
            const educacion = await Educacion.findOne({
                where: { id, usuarioid: decoded.id }
            });

            // Si no se encuentra el registro, devuelve un error 404
            if (!educacion) {
                return res.status(404).json({ success: false, message: 'Education record not found' });
            }

            // Actualiza los campos de educación
            educacion.institucion = institucion || educacion.institucion;
            educacion.gradoObtenido = gradoObtenido || educacion.gradoObtenido;
            educacion.campoEstudio = campoEstudio || educacion.campoEstudio;
            educacion.fechaInicio = fechaInicio || educacion.fechaInicio;
            educacion.fechaFin = fechaFin || educacion.fechaFin;

            // Guarda los cambios en la base de datos
            await educacion.save();

            // Responde con éxito y devuelve el registro actualizado
            res.status(200).json({ success: true, message: 'Education record updated successfully', educacion });
        } catch (error) {
            console.error('Error updating education record:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
