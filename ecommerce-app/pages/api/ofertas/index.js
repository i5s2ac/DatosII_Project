import OfertaEmpleo from '@/models/OfertaEmpleo';

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

                res.status(200).json({ success: true, ofertas });
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
