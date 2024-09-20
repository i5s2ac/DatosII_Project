import CandidatoOferta from '@/../models/CandidatoOferta';
import User from '@/../models/user';
import OfertaEmpleo from '@/../models/ofertaempleo';

// Función para obtener candidatos por empresa
export const getCandidatesByCompany = async (req, res) => {
    const { empresaId } = req.query;

    if (req.method === 'GET') {
        try {
            const candidatos = await CandidatoOferta.findAll({
                include: [
                    {
                        model: User,
                        as: 'candidato',
                        attributes: ['id', 'username', 'email'],
                    },
                    {
                        model: OfertaEmpleo,
                        as: 'ofertaEmpleo',
                        where: { empresaId },
                        attributes: ['id', 'titulo', 'salario'],
                    },
                ],
            });

            if (!candidatos) {
                return res.status(404).json({ success: false, message: 'No se encontraron candidatos' });
            }

            return res.status(200).json({ success: true, candidatos });
        } catch (error) {
            console.error('Error al obtener los candidatos:', error);
            return res.status(500).json({ success: false, message: `Error al obtener los candidatos: ${error.message}` });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Función para actualizar el estado de un candidato
export const updateCandidateStatus = async (req, res) => {
    const { candidatoId, estado } = req.body;

    if (!['pendiente', 'aceptada', 'rechazada'].includes(estado)) {
        return res.status(400).json({ success: false, message: 'Estado no válido' });
    }

    try {
        const candidato = await CandidatoOferta.findByPk(candidatoId);
        if (!candidato) {
            return res.status(404).json({ success: false, message: 'Candidato no encontrado' });
        }

        candidato.estado = estado;
        await candidato.save();

        return res.status(200).json({ success: true, message: 'Candidato actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar candidato:', error);
        return res.status(500).json({ success: false, message: `Error al actualizar candidato: ${error.message}` });
    }
};

// Función para actualizar el estado de una candidatura
export const updateCandidateApplicationStatus = async (req, res) => {
    const { candidatoOfertaId } = req.query;

    if (req.method === 'PUT') {
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ success: false, message: 'El estado es requerido.' });
        }

        try {
            // Verificamos si existe el candidato con ese ID
            const candidato = await CandidatoOferta.findByPk(candidatoOfertaId);

            if (!candidato) {
                return res.status(404).json({ success: false, message: 'Candidato no encontrado.' });
            }

            // Actualizamos el estado de la candidatura
            candidato.estado = estado;
            await candidato.save();

            return res.status(200).json({ success: true, message: 'Estado actualizado correctamente.', candidato });
        } catch (error) {
            console.error('Error al actualizar el candidato:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el candidato.' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido.' });
    }
};

// Función para que un usuario aplique a una oferta de empleo
export const applyToJobOffer = async (req, res) => {
    if (req.method === 'POST') {
        const { usuarioId, ofertaEmpleoId } = req.body;

        if (!usuarioId || !ofertaEmpleoId) {
            return res.status(400).json({ success: false, message: 'Datos incompletos' });
        }

        try {
            // Verificar si el usuario ya ha aplicado a esta oferta
            const candidaturaExistente = await CandidatoOferta.findOne({
                where: {
                    usuarioId,
                    ofertaEmpleoId,
                },
            });

            if (candidaturaExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya has aplicado a esta oferta de empleo',
                });
            }

            // Crear una nueva candidatura
            const nuevaCandidatura = await CandidatoOferta.create({
                usuarioId,
                ofertaEmpleoId,
                estado: 'pendiente', // Estado inicial
            });

            return res.status(201).json({ success: true, data: nuevaCandidatura });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error al aplicar' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Función para verificar si un usuario ya ha aplicado a una oferta de empleo
export const checkApplicationStatus = async (req, res) => {
    if (req.method === 'POST') {
        const { usuarioId, ofertaEmpleoId } = req.body;

        if (!usuarioId || !ofertaEmpleoId) {
            return res.status(400).json({ success: false, message: 'Datos incompletos' });
        }

        try {
            // Buscar si el usuario ya aplicó a esta oferta
            const candidatura = await CandidatoOferta.findOne({
                where: { usuarioId, ofertaEmpleoId },
                attributes: ['estado'],  // Obtener solo el estado
            });

            if (candidatura) {
                return res.status(200).json({ success: true, estado: candidatura.estado });
            } else {
                return res.status(200).json({ success: true, estado: null });
            }
        } catch (error) {
            console.error('Error al verificar el estado de la candidatura:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};