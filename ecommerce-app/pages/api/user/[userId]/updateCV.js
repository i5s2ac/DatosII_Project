import sequelize from '../../../../src/lib/sequelize';
import Skill from '../../../../models/skill';
import Idioma from '../../../../models/Idioma';
import Experiencia from '../../../../models/ExperienciaLaboral';
import Educacion from '../../../../models/Educacion';
import Certificacion from '../../../../models/Certificacion';
import { verifyToken } from '../../../../src/lib/auth';

export default async function updateCompleteCV(req, res) {
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

            const {
                habilidades = [],
                idiomas = [],
                experiencias = [],
                educaciones = [],
                certificaciones = []
            } = req.body;

            // Actualizar habilidades
            if (Array.isArray(habilidades)) {
                await Promise.all(habilidades.map(async (skill) => {
                    if (skill.id) {
                        await Skill.update(
                            {
                                nombre: skill.nombre,
                                nivelDominio: skill.nivelDominio,
                                descripcion: skill.descripcion,
                            },
                            { where: { id: skill.id, usuarioId: decoded.id } }
                        );
                    }
                }));
            }

            // Actualizar idiomas
            if (Array.isArray(idiomas)) {
                await Promise.all(idiomas.map(async (idioma) => {
                    if (idioma.id) {
                        await Idioma.update(
                            {
                                nombre: idioma.nombre,
                                nivelDominio: idioma.nivelDominio,
                            },
                            { where: { id: idioma.id, usuarioId: decoded.id } }
                        );
                    }
                }));
            }

            // Actualizar experiencias
            if (Array.isArray(experiencias)) {
                await Promise.all(experiencias.map(async (exp) => {
                    if (exp.id) {
                        await Experiencia.update(
                            {
                                titulo_puesto: exp.titulo_puesto,
                                empresa: exp.empresa,
                                ubicacion: exp.ubicacion,
                                fecha_inicio: exp.fecha_inicio,
                                fecha_fin: exp.fecha_fin,
                                descripcion: exp.descripcion,
                            },
                            { where: { id: exp.id, usuarioid: decoded.id } }
                        );
                    }
                }));
            }

            // Actualizar educaciones
            if (Array.isArray(educaciones)) {
                await Promise.all(educaciones.map(async (edu) => {
                    if (edu.id) {
                        await Educacion.update(
                            {
                                institucion: edu.institucion,
                                gradoObtenido: edu.gradoObtenido,
                                campoEstudio: edu.campoEstudio,
                                fechaInicio: edu.fechaInicio,
                                fechaFin: edu.fechaFin,
                            },
                            { where: { id: edu.id, usuarioid: decoded.id } }
                        );
                    }
                }));
            }

            // Actualizar certificaciones
            if (Array.isArray(certificaciones)) {
                await Promise.all(certificaciones.map(async (cert) => {
                    if (cert.id) {
                        await Certificacion.update(
                            {
                                nombre: cert.nombre,
                                organizacionEmisora: cert.organizacionEmisora,
                                fechaObtencion: cert.fechaObtencion,
                                descripcion: cert.descripcion,
                            },
                            { where: { id: cert.id, usuarioid: decoded.id } }
                        );
                    }
                }));
            }

            res.status(200).json({ success: true, message: 'CV actualizado exitosamente.' });
        } catch (error) {
            console.error('Error updating CV:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
