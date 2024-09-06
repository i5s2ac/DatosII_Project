import OfertaEmpleo from '../../../models/ofertaempleo';
import sequelize from '@/lib/sequelize';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { titulo, descripcion, ubicacion, salario, fechaPublicacion, fechaCierre, empresaId } = req.body;

        if (!titulo || !empresaId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        try {
            const nuevaOferta = await OfertaEmpleo.create({
                titulo,
                descripcion,
                ubicacion,
                salario,
                fechaPublicacion,
                fechaCierre,
                empresaId,
            });

            res.status(201).json({ success: true, oferta: nuevaOferta });
        } catch (error) {
            console.error('Error creating job offer:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
