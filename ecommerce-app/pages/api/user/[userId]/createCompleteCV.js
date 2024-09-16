import sequelize from '../../../../src/lib/sequelize';
import Skill from '../../../../models/skill';
import Idioma from '../../../../models/Idioma';
import Experiencia from '../../../../models/ExperienciaLaboral';
import Educacion from '../../../../models/Educacion';
import Certificacion from '../../../../models/Certificacion';
import { verifyToken } from '../../../../src/lib/auth';

export default async function createCompleteCV(req, res) {
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

            const {
                habilidades = [],
                idiomas = [],
                experiencias = [],
                educaciones = [],
                certificaciones = []
            } = req.body;

            // Crear habilidades
            if (Array.isArray(habilidades) && habilidades.length > 0) {
                await Promise.all(habilidades.map(skill =>
                    Skill.create({
                        nombre: skill.nombre,
                        nivelDominio: skill.nivelDominio,
                        descripcion: skill.descripcion,
                        usuarioId: decoded.id
                    })
                ));
            }

            // Crear idiomas
            if (Array.isArray(idiomas) && idiomas.length > 0) {
                await Promise.all(idiomas.map(idioma =>
                    Idioma.create({
                        nombre: idioma.nombre,
                        nivelDominio: idioma.nivelDominio,
                        usuarioId: decoded.id
                    })
                ));
            }

            // Crear experiencias
            if (Array.isArray(experiencias) && experiencias.length > 0) {
                await Promise.all(experiencias.map(exp =>
                    Experiencia.create({
                        usuarioid: decoded.id,
                        titulo_puesto: exp.titulo_puesto,
                        empresa: exp.empresa,
                        ubicacion: exp.ubicacion,
                        fecha_inicio: exp.fecha_inicio,
                        fecha_fin: exp.fecha_fin,
                        descripcion: exp.descripcion
                    })
                ));
            }

            // Crear educaciones
            if (Array.isArray(educaciones) && educaciones.length > 0) {
                await Promise.all(educaciones.map(edu =>
                    Educacion.create({
                        institucion: edu.institucion,
                        gradoObtenido: edu.gradoObtenido,
                        campoEstudio: edu.campoEstudio,
                        fechaInicio: edu.fechaInicio,
                        fechaFin: edu.fechaFin,
                        usuarioid: decoded.id
                    })
                ));
            }

            // Crear certificaciones
            if (Array.isArray(certificaciones) && certificaciones.length > 0) {
                await Promise.all(certificaciones.map(cert =>
                    Certificacion.create({
                        nombre: cert.nombre,
                        organizacionEmisora: cert.organizacionEmisora,
                        fechaObtencion: cert.fechaObtencion,
                        descripcion: cert.descripcion,
                        usuarioid: decoded.id
                    })
                ));
            }

            res.status(201).json({ success: true, message: 'CV creado exitosamente.' });
        } catch (error) {
            console.error('Error creating CV:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

