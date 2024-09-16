import sequelize from '../../../../../src/lib/sequelize';
import Skill from '../../../../../models/skill';
import { verifyToken } from '../../../../../src/lib/auth';

export default async function createSkill(req, res) {
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

            const { nombre, nivelDominio, descripcion } = req.body;

            // Verifica que todos los datos necesarios estén presentes
            if (!nombre || !decoded.id) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            // Crear nuevo skill
            const nuevoSkill = await Skill.create({
                nombre,
                nivelDominio,
                descripcion,
                usuarioId: decoded.id
            });

            res.status(201).json({ success: true, skill: nuevoSkill });
        } catch (error) {
            console.error('Error creating skill:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
