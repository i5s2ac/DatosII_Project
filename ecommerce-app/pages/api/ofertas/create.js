import OfertaEmpleo from '../../../models/ofertaempleo';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { titulo, descripcion, ubicacion, salario, fechaCierre, tags, modalidad, tipoTrabajo, empresaId, userId } = req.body;

        // Validación: Verificar que los campos requeridos no estén vacíos
        if (!titulo) {
            return res.status(400).json({ success: false, message: 'Falta el campo: título' });
        }
        if (!descripcion || descripcion.length > 255) {
            return res.status(400).json({ success: false, message: 'La descripción debe tener un máximo de 255 caracteres.' });
        }
        if (!empresaId) {
            return res.status(400).json({ success: false, message: 'Falta el campo: empresaId' });
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Falta el campo: userId' });
        }

        // Verificar que tags es un array
        if (!Array.isArray(tags)) {
            return res.status(400).json({ success: false, message: 'Los tags deben ser un arreglo.' });
        }

        if (tags && tags.length > 3) {
            return res.status(400).json({ success: false, message: 'No se pueden agregar más de 3 tags.' });
        }

        // Verificar que la fecha de cierre sea válida
        const fechaCierreDate = new Date(fechaCierre);
        const fechaActual = new Date();
        if (fechaCierreDate <= fechaActual) {
            return res.status(400).json({ success: false, message: 'La fecha de cierre debe ser posterior al día de hoy.' });
        }

        try {
            // Crea la nueva oferta de empleo
            const nuevaOferta = await OfertaEmpleo.create({
                titulo,
                descripcion,
                ubicacion,
                salario,
                fechaPublicacion: new Date(),  // Fecha actual
                fechaCierre,
                estatus: 'Activo',  // Por defecto es activo
                tags,  // Pass tags directly, Sequelize model will handle conversion
                modalidad,
                tipoTrabajo,
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
