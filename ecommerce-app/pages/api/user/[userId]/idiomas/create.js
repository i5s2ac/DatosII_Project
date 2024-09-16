import sequelize from '../../../../../src/lib/sequelize';
import Idioma from '../../../../../models/Idioma';
import { verifyToken } from '../../../../../src/lib/auth';

export default async function createIdioma(req, res) {
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Received token:', token);

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        console.log('Decoded token:', decoded);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        try {
            await sequelize.authenticate();

            const { nombre, nivelDominio } = req.body;
            console.log('Request body:', { nombre, nivelDominio });

            // Crear nuevo idioma
            const nuevoIdioma = await Idioma.create({
                nombre,
                nivelDominio,
                usuarioId: decoded.id
            });

            res.status(201).json({ success: true, idioma: nuevoIdioma });
        } catch (error) {
            console.error('Error creating language:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
