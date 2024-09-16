import OfertaEmpleo from '../../../../models/ofertaempleo';
import Empresa from '../../../../models/Empresa';
import User from '../../../../models/user'; // Asegúrate de que la ruta sea correcta
import { Op } from 'sequelize';

export default async function handler(req, res) {
    const { userId, q, ubicacion, tipoTrabajo, modalidad } = req.query;

    if (req.method === 'GET') {
        try {
            const whereClause = {
                estatus: 'Activo', // Solo ofertas con estatus "Activo"
            };

            if (q) {
                whereClause.titulo = {
                    [Op.iLike]: `%${q}%`,
                };
            }

            if (ubicacion) {
                whereClause.ubicacion = {
                    [Op.iLike]: `%${ubicacion}%`,
                };
            }

            if (tipoTrabajo) {
                whereClause.tipoTrabajo = tipoTrabajo;
            }

            if (modalidad) {
                whereClause.modalidad = modalidad;
            }

            // Obtener todas las ofertas de empleo activas
            const ofertas = await OfertaEmpleo.findAll({
                where: whereClause,
                order: [['fechaPublicacion', 'DESC']],
            });

            if (ofertas.length === 0) {
                return res.status(200).json({ success: true, ofertas: [] });
            }

            // Obtener los IDs únicos de empresas
            const empresaIds = [...new Set(ofertas.map((oferta) => oferta.empresaId))];

            // Obtener información de las empresas
            const empresas = await Empresa.findAll({
                where: {
                    id: empresaIds,
                },
                attributes: ['id', 'nombre', 'telefono', 'sitioWeb', 'email', 'descripcion', 'direccion'],
            });

            // Crear un mapa de empresas por ID
            const empresasMap = {};
            empresas.forEach((empresa) => {
                empresasMap[empresa.id] = empresa;
            });

            // Obtener el usuario para el userId
            const usuario = await User.findOne({
                where: { id: userId },
                attributes: ['username'], // Solo traemos el nombre de usuario
            });

            if (!usuario) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Agregar información de la empresa y el nombre de usuario a cada oferta
            const ofertasConEmpresaYUsuario = ofertas.map((oferta) => {
                const empresa = empresasMap[oferta.empresaId];
                return {
                    ...oferta.toJSON(),
                    empresa: empresa ? empresa.toJSON() : null,
                    usuario: usuario.username, // Agregamos el nombre de usuario
                };
            });

            // Respuesta exitosa con las ofertas encontradas y el nombre de usuario
            res.status(200).json({ success: true, ofertas: ofertasConEmpresaYUsuario });
        } catch (error) {
            console.error('Error fetching job offers:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
