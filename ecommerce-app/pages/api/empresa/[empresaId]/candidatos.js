import CandidatoOferta from '../../../../models/CandidatoOferta';
import User from '../../../../models/user';
import OfertaEmpleo from '../../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { empresaId } = req.query;

    if (req.method === 'GET') {
        try {
            // Obtener los candidatos que aplicaron a las ofertas de empleo de esta empresa
            const candidatos = await CandidatoOferta.findAll({
                include: [
                    {
                        model: User,
                        as: 'candidato',
                        attributes: ['id', 'username', 'email'],  // Cambiado de 'nombre' a 'username'
                    },
                    {
                        model: OfertaEmpleo,
                        as: 'ofertaEmpleo',
                        where: { empresaId },
                        attributes: ['id', 'titulo', 'salario'],
                    },
                ],
            });

            if (!candidatos) {
                return res.status(404).json({ success: false, message: 'No se encontraron candidatos' });
            }

            res.status(200).json({ success: true, candidatos });

        } catch (error) {
            console.error('Error al obtener los candidatos:', error);
            res.status(500).json({ success: false, message: `Error al obtener los candidatos: ${error.message}` });
        }
    } else if (req.method === 'PUT') {
        const { candidatoId, estado } = req.body;

        if (!['pendiente', 'aceptada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ success: false, message: 'Estado no válido' });
        }

        try {
            // Actualizar el estado del candidato
            const candidato = await CandidatoOferta.findByPk(candidatoId);
            if (!candidato) {
                return res.status(404).json({ success: false, message: 'Candidato no encontrado' });
            }

            candidato.estado = estado;
            await candidato.save();

            res.status(200).json({ success: true, message: 'Candidato actualizado correctamente' });

        } catch (error) {
            console.error('Error al actualizar candidato:', error);
            res.status(500).json({ success: false, message: `Error al actualizar candidato: ${error.message}` });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
