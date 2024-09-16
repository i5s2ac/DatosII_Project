// C:\Users\Paco\Documents\Github\DatosII_Project\ecommerce-app\pages\api\user\[userId]\skills\put.js
import sequelize from '../../../../../src/lib/sequelize';
import Skill from '../../../../../models/Skill'; // Ajusta el path según tu estructura de modelos
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

            const { id, nombre, nivelDominio, descripcion } = req.body;

            // Verifica que todos los campos necesarios estén presentes
            if (!id || !nombre || !nivelDominio) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            // Busca la habilidad por su ID y el usuario autenticado
            const skill = await Skill.findOne({
                where: { id, usuarioId: decoded.id }
            });

            if (!skill) {
                return res.status(404).json({ success: false, message: 'Skill not found' });
            }

            // Actualiza los campos si son proporcionados
            skill.nombre = nombre;
            skill.nivelDominio = nivelDominio;
            skill.descripcion = descripcion;

            // Guarda los cambios en la base de datos
            await skill.save();

            res.status(200).json({ success: true, message: 'Skill updated successfully', skill });
        } catch (error) {
            console.error('Error updating skill:', error.message); // Muestra el mensaje de error específico
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
