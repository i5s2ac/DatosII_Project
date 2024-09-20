import Empresa from '@/../models/Empresa';
import User from '@/../models/user'; // Asegúrate de que la ruta sea correcta
import OfertaEmpleo from '@/../models/ofertaempleo';

import { Op } from 'sequelize';

// Función para crear una nueva oferta de empleo
export const createJobOffer = async (req, res) => {
    if (req.method === 'POST') {
        const {
            titulo,
            descripcion,
            ubicacion,
            salario,
            fechaCierre,
            tags,
            modalidad,
            tipoTrabajo,
            empresaId,
            userId,
            Funciones_Requerimiento,
            Estudios_Requerimiento,
            Experiencia_Requerimiento,
            Conocimientos_Requerimiento,
            Competencias__Requerimiento
        } = req.body;

        // Validaciones de campos
        if (!titulo || !descripcion || !empresaId || !userId) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
        }

        // Validaciones adicionales
        if (tags && !Array.isArray(tags)) {
            return res.status(400).json({ success: false, message: 'Los tags deben ser un arreglo.' });
        }
        if (fechaCierre && new Date(fechaCierre) <= new Date()) {
            return res.status(400).json({ success: false, message: 'La fecha de cierre debe ser posterior al día de hoy.' });
        }

        try {
            const nuevaOferta = await OfertaEmpleo.create({
                titulo,
                descripcion,
                ubicacion,
                salario,
                fechaPublicacion: new Date(),
                fechaCierre,
                estatus: 'Activo',
                tags,
                modalidad,
                tipoTrabajo,
                empresaId,
                userId,
                Funciones_Requerimiento: Funciones_Requerimiento || null,
                Estudios_Requerimiento: Estudios_Requerimiento || null,
                Experiencia_Requerimiento: Experiencia_Requerimiento || null,
                Conocimientos_Requerimiento: Conocimientos_Requerimiento || null,
                Competencias__Requerimiento: Competencias__Requerimiento || null
            });

            res.status(201).json({ success: true, oferta: nuevaOferta });
        } catch (error) {
            console.error('Error al crear la oferta de empleo:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Función para buscar ofertas de empleo con filtros
export const searchJobOffers = async (req, res) => {
    const { userId, q, ubicacion, tipoTrabajo, modalidad } = req.query;

    if (req.method === 'GET') {
        try {
            const whereClause = {
                estatus: 'Activo', // Solo ofertas con estatus "Activo"
            };

            if (q) {
                whereClause.titulo = {
                    [Op.iLike]: `%${q}%`,
                };
            }

            if (ubicacion) {
                whereClause.ubicacion = {
                    [Op.iLike]: `%${ubicacion}%`,
                };
            }

            if (tipoTrabajo) {
                whereClause.tipoTrabajo = tipoTrabajo;
            }

            if (modalidad) {
                whereClause.modalidad = modalidad;
            }

            // Obtener todas las ofertas de empleo activas
            const ofertas = await OfertaEmpleo.findAll({
                where: whereClause,
                order: [['fechaPublicacion', 'DESC']],
            });

            if (ofertas.length === 0) {
                return res.status(200).json({ success: true, ofertas: [] });
            }

            // Obtener los IDs únicos de empresas
            const empresaIds = [...new Set(ofertas.map((oferta) => oferta.empresaId))];

            // Obtener información de las empresas
            const empresas = await Empresa.findAll({
                where: {
                    id: empresaIds,
                },
                attributes: ['id', 'nombre', 'telefono', 'sitioWeb', 'email', 'descripcion', 'direccion'],
            });

            // Crear un mapa de empresas por ID
            const empresasMap = {};
            empresas.forEach((empresa) => {
                empresasMap[empresa.id] = empresa;
            });

            // Obtener el usuario para el userId
            const usuario = await User.findOne({
                where: { id: userId },
                attributes: ['username'], // Solo traemos el nombre de usuario
            });

            if (!usuario) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Agregar información de la empresa y el nombre de usuario a cada oferta
            const ofertasConEmpresaYUsuario = ofertas.map((oferta) => {
                const empresa = empresasMap[oferta.empresaId];
                return {
                    ...oferta.toJSON(),
                    empresa: empresa ? empresa.toJSON() : null,
                    usuario: usuario.username, // Agregamos el nombre de usuario
                };
            });

            // Respuesta exitosa con las ofertas encontradas y el nombre de usuario
            return res.status(200).json({ success: true, ofertas: ofertasConEmpresaYUsuario });
        } catch (error) {
            console.error('Error fetching job offers:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Función para actualizar una oferta de empleo existente
export const updateJobOffer = async (req, res) => {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const {
            titulo,
            descripcion,
            ubicacion,
            salario,
            fechaCierre,
            tags,
            modalidad,
            tipoTrabajo,
            estatus,
            Funciones_Requerimiento,
            Estudios_Requerimiento,
            Experiencia_Requerimiento,
            Conocimientos_Requerimiento,
            Competencias__Requerimiento
        } = req.body;

        try {
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
            }

            // Validaciones de los campos
            if (titulo !== undefined && titulo.trim() === '') {
                return res.status(400).json({ success: false, message: 'El campo título no puede estar vacío' });
            }
            if (descripcion !== undefined && (descripcion.trim() === '' || descripcion.length > 255)) {
                return res.status(400).json({ success: false, message: 'La descripción debe tener un máximo de 255 caracteres.' });
            }
            if (tags !== undefined && (!Array.isArray(tags) || tags.length > 3)) {
                return res.status(400).json({ success: false, message: 'Los tags deben ser un arreglo y no tener más de 3.' });
            }
            if (fechaCierre !== undefined && new Date(fechaCierre) <= new Date()) {
                return res.status(400).json({ success: false, message: 'La fecha de cierre debe ser posterior al día de hoy.' });
            }

            // Validar y actualizar los nuevos campos
            const nuevosCampos = { Funciones_Requerimiento, Estudios_Requerimiento, Experiencia_Requerimiento, Conocimientos_Requerimiento, Competencias__Requerimiento };
            for (const [campo, valor] of Object.entries(nuevosCampos)) {
                if (valor !== undefined && typeof valor !== 'string') {
                    return res.status(400).json({ success: false, message: `El campo ${campo} debe ser una cadena de texto.` });
                }
            }

            // Actualizar los campos de la oferta
            if (titulo !== undefined) oferta.titulo = titulo;
            if (descripcion !== undefined) oferta.descripcion = descripcion;
            if (ubicacion !== undefined) oferta.ubicacion = ubicacion;
            if (salario !== undefined) oferta.salario = salario;
            if (fechaCierre !== undefined) oferta.fechaCierre = fechaCierre;
            if (tags !== undefined) oferta.tags = tags;
            if (modalidad !== undefined) oferta.modalidad = modalidad;
            if (tipoTrabajo !== undefined) oferta.tipoTrabajo = tipoTrabajo;
            if (estatus !== undefined) oferta.estatus = estatus;

            // Actualizar nuevos campos si están presentes
            Object.entries(nuevosCampos).forEach(([campo, valor]) => {
                if (valor !== undefined) oferta[campo] = valor || null;
            });

            // Guardar los cambios
            await oferta.save();

            return res.status(200).json({ success: true, oferta });
        } catch (error) {
            console.error('Error al actualizar la oferta de empleo:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Función para eliminar una oferta de empleo
export const deleteJobOffer = async (req, res) => {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Job offer not found' });
            }

            await oferta.destroy();
            return res.status(200).json({ success: true, message: 'Job offer deleted' });
        } catch (error) {
            console.error('Error deleting job offer:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};

// Función para obtener ofertas de empleo por empresaId, con filtro opcional por userId
export const getJobOffersByCompany = async (req, res) => {
    const { empresaId, userId } = req.query;

    if (req.method === 'GET') {
        try {
            if (empresaId) {
                const whereClause = {
                    empresaId: empresaId,
                };

                // Agregar filtro por userId si está presente
                if (userId) {
                    whereClause.userId = userId;
                }

                const ofertas = await OfertaEmpleo.findAll({
                    where: whereClause,
                    order: [['fechaPublicacion', 'DESC']],
                });

                if (ofertas.length === 0) {
                    return res.status(404).json({ success: false, message: 'No job offers found for this company' });
                }

                // Contar plazas activas e inactivas
                const plazasActivas = ofertas.filter(oferta => oferta.estatus === 'Activo').length;
                const plazasInactivas = ofertas.filter(oferta => oferta.estatus === 'Inactivo').length;

                // Devolver el resultado junto con las ofertas
                return res.status(200).json({
                    success: true,
                    ofertas,
                    plazasActivas,
                    plazasInactivas
                });
            } else {
                return res.status(400).json({ success: false, message: 'Missing empresaId in query' });
            }
        } catch (error) {
            console.error('Error fetching job offers:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};

// Función para obtener una oferta de empleo por su ID
export const getJobOfferById = async (req, res) => {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
            }

            return res.status(200).json({ success: true, oferta });
        } catch (error) {
            console.error('Error fetching job offer:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};