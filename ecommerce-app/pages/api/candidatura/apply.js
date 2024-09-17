// pages/api/candidatura/apply.js
import CandidatoOferta from '../../../models/CandidatoOferta';
import { sequelize } from '../../../src/lib/sequelize';

export default async function handler(req, res) {
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
                // Si el usuario ya ha aplicado, devolver un error
                return res.status(400).json({
                    success: false,
                    message: 'Ya has aplicado a esta oferta de empleo'
                });
            }

            // Crear una nueva entrada en CandidatoOferta
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
        // Método no permitido
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
