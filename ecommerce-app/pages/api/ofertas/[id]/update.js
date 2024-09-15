import OfertaEmpleo from '../../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { id } = req.query;  // Asegúrate de usar 'id'

    if (req.method === 'PUT') {
        try {
            const oferta = await OfertaEmpleo.findByPk(id);

            if (!oferta) {
                return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
            }

            const { titulo, descripcion, ubicacion, salario, fechaPublicacion, fechaCierre,estatus } = req.body;

            oferta.titulo = titulo || oferta.titulo;
            oferta.descripcion = descripcion || oferta.descripcion;
            oferta.ubicacion = ubicacion || oferta.ubicacion;
            oferta.salario = salario || oferta.salario;
            oferta.fechaPublicacion = fechaPublicacion || oferta.fechaPublicacion;
            oferta.fechaCierre = fechaCierre || oferta.fechaCierre;
            oferta.estatus = estatus || oferta.estatus;


            await oferta.save();

            res.status(200).json({ success: true, oferta });
        } catch (error) {
            console.error('Error updating offer:', error);
            res.status(500).json({ success: false, message: 'Error actualizando la oferta' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
