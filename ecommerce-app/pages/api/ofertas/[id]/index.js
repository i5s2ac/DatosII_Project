import OfertaEmpleo from '../../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Job offer not found' });
            }

            res.status(200).json({ success: true, oferta });
        } catch (error) {
            console.error('Error fetching job offer:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
