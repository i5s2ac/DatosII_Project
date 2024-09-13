import OfertaEmpleo from '../../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { userId } = req.query;

    if (req.method === 'GET') {
        try {


            // Busca todas las ofertas de empleo creadas por el usuario
            const ofertas = await OfertaEmpleo.findAll({

                order: [['fechaPublicacion', 'DESC']], // Ordena por fecha de publicación
            });

            // Si no hay ofertas para el usuario
            if (ofertas.length === 0) {
                return res.status(404).json({ success: false, message: 'No se encontraron ofertas para este usuario' });
            }

            // Respuesta exitosa con las ofertas encontradas
            res.status(200).json({ success: true, ofertas });
        } catch (error) {
            console.error('Error fetching job offers:', error);

            // Manejo de errores internos del servidor
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        // Método no permitido
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}