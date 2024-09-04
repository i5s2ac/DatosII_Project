import OfertaEmpleo from '@/models/OfertaEmpleo';
import sequelize from '@/lib/sequelize';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await sequelize.sync(); // Sincroniza la base de datos

        const { titulo, descripcion, ubicacion, salario, fechaPublicacion, fechaCierre, empresaId, userId } = req.body;

        // Validación: Verificar que los campos requeridos no estén vacíos
        if (!titulo) {
            return res.status(400).json({ success: false, message: 'Missing field: titulo' });
        }
        if (!empresaId) {
            return res.status(400).json({ success: false, message: 'Missing field: empresaId' });
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing field: userId' });
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
                userId, // Asegúrate de que el userId sea pasado al crear la oferta
            });

            res.status(201).json({ success: true, oferta: nuevaOferta });
        } catch (error) {
            console.error('Error creating job offer:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
