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
