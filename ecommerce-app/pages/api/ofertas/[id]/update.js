import OfertaEmpleo from '../../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { id } = req.query;  // Obtenemos el ID de la oferta desde la URL

    if (req.method === 'PUT') {
        const { titulo, descripcion, ubicacion, salario, fechaCierre, tags, modalidad, tipoTrabajo, estatus } = req.body;

        try {
            // Encontrar la oferta de empleo existente
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
            }

            // Validación: Verificar que los campos requeridos no estén vacíos
            if (titulo !== undefined && titulo === '') {
                return res.status(400).json({ success: false, message: 'El campo título no puede estar vacío' });
            }
            if (descripcion !== undefined && (descripcion === '' || descripcion.length > 255)) {
                return res.status(400).json({ success: false, message: 'La descripción debe tener un máximo de 255 caracteres.' });
            }

            // Verificar que tags es un array si se proporciona
            if (tags !== undefined) {
                if (!Array.isArray(tags)) {
                    return res.status(400).json({ success: false, message: 'Los tags deben ser un arreglo.' });
                }
                if (tags.length > 3) {
                    return res.status(400).json({ success: false, message: 'No se pueden agregar más de 3 tags.' });
                }
            }

            // Verificar que la fecha de cierre sea válida si se proporciona
            if (fechaCierre !== undefined) {
                const fechaCierreDate = new Date(fechaCierre);
                const fechaActual = new Date();
                if (fechaCierreDate <= fechaActual) {
                    return res.status(400).json({ success: false, message: 'La fecha de cierre debe ser posterior al día de hoy.' });
                }
            }

            // Actualizar los campos de la oferta
            if (titulo !== undefined) oferta.titulo = titulo;
            if (descripcion !== undefined) oferta.descripcion = descripcion;
            if (ubicacion !== undefined) oferta.ubicacion = ubicacion;
            if (salario !== undefined) oferta.salario = salario;
            if (fechaCierre !== undefined) oferta.fechaCierre = fechaCierre;
            if (tags !== undefined) oferta.tags = tags; // El modelo debe manejar la conversión de arreglo a cadena
            if (modalidad !== undefined) oferta.modalidad = modalidad;
            if (tipoTrabajo !== undefined) oferta.tipoTrabajo = tipoTrabajo;
            if (estatus !== undefined) oferta.estatus = estatus;  // Agregamos la actualización del estatus

            // Guardar los cambios
            await oferta.save();

            res.status(200).json({ success: true, oferta });
        } catch (error) {
            console.error('Error al actualizar la oferta de empleo:', error.message);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
