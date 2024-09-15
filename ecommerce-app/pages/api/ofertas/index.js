import OfertaEmpleo from '../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { empresaId, userId } = req.query;

    if (req.method === 'GET') {
        try {
            if (empresaId) {
                const whereClause = {
                    empresaId: empresaId,
                };

                // Agrega un filtro opcional por userId solo si está definido
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

                // Contar cuántas plazas están activas e inactivas
                const plazasActivas = ofertas.filter(oferta => oferta.estatus === 'Activo').length;
                const plazasInactivas = ofertas.filter(oferta => oferta.estatus === 'Inactivo').length;

                // Devolver el resultado junto con las ofertas
                res.status(200).json({
                    success: true,
                    ofertas,
                    plazasActivas,
                    plazasInactivas
                });
            } else {
                res.status(400).json({ success: false, message: 'Missing empresaId in query' });
            }
        } catch (error) {
            console.error('Error fetching job offers:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
