import CandidatoOferta from '../../../models/CandidatoOferta';  // Ajusta la ruta según la estructura de tus modelos

export default async function handler(req, res) {
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
                // Retornar el estado si existe una candidatura
                return res.status(200).json({ success: true, estado: candidatura.estado });
            } else {
                // Si no hay candidatura, retornar false
                return res.status(200).json({ success: true, estado: null });
            }
        } catch (error) {
            console.error('Error al verificar el estado de la candidatura:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        // Método no permitido
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
