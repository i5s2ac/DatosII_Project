import OfertaEmpleo from '../../../models/ofertaempleo';
import sequelize from '@/lib/sequelize';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { titulo, descripcion, ubicacion, salario, fechaPublicacion, fechaCierre, estatus = 'Activo', empresaId, userId } = req.body;

        // Validación: Verificar que los campos requeridos no estén vacíos
        if (!titulo) {
            return res.status(400).json({ success: false, message: 'Falta el campo: título' });
        }
        if (!empresaId) {
            return res.status(400).json({ success: false, message: 'Falta el campo: empresaId' });
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Falta el campo: userId' });
        }

        try {
            // Crea la nueva oferta de empleo
            const nuevaOferta = await OfertaEmpleo.create({
                titulo,
                descripcion,
                ubicacion,
                salario,
                fechaPublicacion,
                fechaCierre,
                estatus, // Valor por defecto será "Activo" si no se pasa explícitamente
                empresaId,
                userId,
            });

            res.status(201).json({ success: true, oferta: nuevaOferta });
        } catch (error) {
            console.error('Error al crear la oferta de empleo:', error.message);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
