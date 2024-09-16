// pages/api/user/[userId]/company.js
import { empresaUsuario } from '../../../../models/EmpresaUsuario'; // Ajusta la ruta a tu modelo

export default async function handler(req, res) {
    const { userId } = req.query;

    if (req.method === 'GET') {
        try {
            const result = await empresaUsuario.findOne({
                where: { usuarioId: parseInt(userId, 10) }
            });

            res.status(200).json({ isInCompany: !!result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al verificar la relación con la empresa' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
