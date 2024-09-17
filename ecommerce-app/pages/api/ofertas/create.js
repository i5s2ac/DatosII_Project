import OfertaEmpleo from '../../../models/ofertaempleo';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            titulo,
            descripcion,
            ubicacion,
            salario,
            fechaCierre,
            tags,
            modalidad,
            tipoTrabajo,
            empresaId,
            userId,
            Funciones_Requerimiento,
            Estudios_Requerimiento,
            Experiencia_Requerimiento,
            Conocimientos_Requerimiento,
            Competencias__Requerimiento
        } = req.body;

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

        // Validación: Verificar que tags es un array
        if (tags && !Array.isArray(tags)) {
            return res.status(400).json({ success: false, message: 'Los tags deben ser un arreglo.' });
        }

        // Validación: Número máximo de tags
        if (tags && tags.length > 3) {
            return res.status(400).json({ success: false, message: 'No se pueden agregar más de 3 tags.' });
        }

        // Validación: Verificar que la fecha de cierre sea válida
        if (fechaCierre) {
            const fechaCierreDate = new Date(fechaCierre);
            const fechaActual = new Date();
            if (isNaN(fechaCierreDate.getTime())) {
                return res.status(400).json({ success: false, message: 'La fecha de cierre no es una fecha válida.' });
            }
            if (fechaCierreDate <= fechaActual) {
                return res.status(400).json({ success: false, message: 'La fecha de cierre debe ser posterior al día de hoy.' });
            }
        }

        // Validación: Verificar que los nuevos campos sean strings si están presentes
        const nuevosCampos = {
            Funciones_Requerimiento,
            Estudios_Requerimiento,
            Experiencia_Requerimiento,
            Conocimientos_Requerimiento,
            Competencias__Requerimiento
        };

        for (const [campo, valor] of Object.entries(nuevosCampos)) {
            if (valor && typeof valor !== 'string') {
                return res.status(400).json({ success: false, message: `El campo ${campo} debe ser una cadena de texto.` });
            }
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
                tags,  // Sequelize manejará la conversión a cadena separada por comas
                modalidad,
                tipoTrabajo,
                empresaId,
                userId,
                Funciones_Requerimiento: Funciones_Requerimiento || null,
                Estudios_Requerimiento: Estudios_Requerimiento || null,
                Experiencia_Requerimiento: Experiencia_Requerimiento || null,
                Conocimientos_Requerimiento: Conocimientos_Requerimiento || null,
                Competencias__Requerimiento: Competencias__Requerimiento || null
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
