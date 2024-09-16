// C:\Users\Paco\Documents\Github\DatosII_Project\ecommerce-app\pages\api\user\[userId]\idiomas\put.js
import sequelize from '../../../../../src/lib/sequelize';
import Idioma from '../../../../../models/Idioma'; // Ajusta el path según tu estructura de modelos
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

            const { id, nombre, nivelDominio } = req.body;

            // Busca el idioma por su ID y el usuario autenticado
            const idioma = await Idioma.findOne({
                where: { id, usuarioId: decoded.id }
            });

            if (!idioma) {
                return res.status(404).json({ success: false, message: 'Language not found' });
            }

            // Actualiza los campos si son proporcionados
            idioma.nombre = nombre || idioma.nombre;
            idioma.nivelDominio = nivelDominio || idioma.nivelDominio;

            // Guarda los cambios en la base de datos
            await idioma.save();

            res.status(200).json({ success: true, message: 'Language updated successfully', idioma });
        } catch (error) {
            console.error('Error updating language:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
