import CandidatoOferta from '../../../../../../models/CandidatoOferta';

export default async function handler(req, res) {
    const { candidatoOfertaId } = req.query;

    if (req.method === 'PUT') {
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ success: false, message: "El estado es requerido." });
        }

        try {
            // Verificamos si existe el candidato con ese ID
            const candidato = await CandidatoOferta.findByPk(candidatoOfertaId);

            if (!candidato) {
                return res.status(404).json({ success: false, message: "Candidato no encontrado." });
            }

            // Actualizamos el estado de la candidatura
            candidato.estado = estado;
            await candidato.save();

            res.status(200).json({ success: true, message: "Estado actualizado correctamente.", candidato });
        } catch (error) {
            console.error('Error al actualizar el candidato:', error);
            res.status(500).json({ success: false, message: "Error al actualizar el candidato." });
        }
    } else {
        res.status(405).json({ success: false, message: "Método no permitido." });
    }
}
