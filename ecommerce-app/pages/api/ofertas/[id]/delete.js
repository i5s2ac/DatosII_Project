import OfertaEmpleo from '@/models/OfertaEmpleo';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Job offer not found' });
            }

            await oferta.destroy();
            res.status(200).json({ success: true, message: 'Job offer deleted' });
        } catch (error) {
            console.error('Error deleting job offer:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
