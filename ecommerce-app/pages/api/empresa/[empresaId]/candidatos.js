import CandidatoOferta from '../../../../models/CandidatoOferta';
import User from '../../../../models/user';
import OfertaEmpleo from '../../../../models/ofertaempleo';

export default async function handler(req, res) {
    const { empresaId } = req.query;

    if (req.method === 'GET') {
        try {
            // Obtener los candidatos que aplicaron a las ofertas de empleo de esta empresa
            const candidatos = await CandidatoOferta.findAll({
                where: { estado: 'pendiente' },
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

            if (candidatos) {
                res.status(200).json({ success: true, candidatos });
            } else {
                res.status(404).json({ success: false, message: 'No se encontraron candidatos' });
            }
        } catch (error) {
            console.error('Error al obtener los candidatos:', error);
            res.status(500).json({ success: false, message: `Error al obtener los candidatos: ${error.message}` });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
