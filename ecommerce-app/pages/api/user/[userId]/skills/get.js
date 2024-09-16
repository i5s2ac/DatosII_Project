
import sequelize from '../../../../../src/lib/sequelize';
import Skill from '../../../../../models/Skill'; // Asegúrate de ajustar la importación según tu modelo
import { verifyToken } from '../../../../../src/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'GET') {
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

            // Consulta todas las habilidades (skills) del usuario autenticado
            const skills = await Skill.findAll({
                where: { usuarioId: decoded.id }
            });

            if (skills.length === 0) {
                return res.status(404).json({ success: false, message: 'No skills found for this user' });
            }

            res.status(200).json(skills);
        } catch (error) {
            console.error('Error fetching skills:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
