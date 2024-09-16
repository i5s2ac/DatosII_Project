import sequelize from '../../../../src/lib/sequelize';
import Skill from '../../../../models/skill';
import Idioma from '../../../../models/Idioma';
import Experiencia from '../../../../models/ExperienciaLaboral';
import Educacion from '../../../../models/Educacion';
import Certificacion from '../../../../models/Certificacion';
import { verifyToken } from '../../../../src/lib/auth';

export default async function getCompleteCV(req, res) {
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

            // Obtener las habilidades del usuario
            const habilidades = await Skill.findAll({ where: { usuarioId: decoded.id } });

            // Obtener los idiomas del usuario
            const idiomas = await Idioma.findAll({ where: { usuarioId: decoded.id } });

            // Obtener las experiencias del usuario
            const experiencias = await Experiencia.findAll({ where: { usuarioid: decoded.id } });

            // Obtener las educaciones del usuario
            const educaciones = await Educacion.findAll({ where: { usuarioid: decoded.id } });

            // Obtener las certificaciones del usuario
            const certificaciones = await Certificacion.findAll({ where: { usuarioid: decoded.id } });

            // Enviar todos los datos en la respuesta
            res.status(200).json({
                success: true,
                data: {
                    habilidades,
                    idiomas,
                    experiencias,
                    educaciones,
                    certificaciones
                }
            });
        } catch (error) {
            console.error('Error fetching CV:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
