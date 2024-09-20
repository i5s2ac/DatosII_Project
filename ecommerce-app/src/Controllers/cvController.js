import sequelize from '@/lib/sequelize.js';
import Skill from '@/../models/skill';
import Idioma from '@/../models/Idioma';
import Experiencia from '@/../models/ExperienciaLaboral';
import Educacion from '@/../models/Educacion';
import Certificacion from '@/../models/Certificacion';
import { verifyToken } from '@/lib/auth';  // Ajusta la ruta según tu estructura
import User from '@/../models/user';  // Ajusta la ruta según tu estructura

// Función para crear un CV completo
export const createCompleteCV = async (req, res) => {
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

            return res.status(201).json({ success: true, message: 'CV creado exitosamente.' });
        } catch (error) {
            console.error('Error creating CV:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};

// Función para obtener el CV completo del usuario
export const getCompleteCV = async (req, res) => {
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
            return res.status(200).json({
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
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};

// Función para actualizar un CV completo
export const updateCompleteCV = async (req, res) => {
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

            return res.status(200).json({ success: true, message: 'CV actualizado exitosamente.' });
        } catch (error) {
            console.error('Error updating CV:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};

