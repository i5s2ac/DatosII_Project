import OfertaEmpleo from '@/models/OfertaEmpleo';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const ofertas = await OfertaEmpleo.findAll();
            res.status(200).json({ success: true, ofertas });
        } catch (error) {
            console.error('Error fetching job offers:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
