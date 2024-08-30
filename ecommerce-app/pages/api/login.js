import sequelize from '@/lib/sequelize';
import User from '@/models/User';
import EmpresaUsuario from '@/models/EmpresaUsuario';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Buscar al usuario por email
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' });
            }

            // Comparar la contraseña
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ success: false, message: 'Incorrect password' });
            }

            // Buscar la relación empresa-usuario-rol si existe
            const empresaUsuario = await EmpresaUsuario.findOne({ where: { usuarioId: user.id } });

            // Crear el token con los datos disponibles
            const tokenPayload = {
                id: user.id,
                email: user.email,
                empresaId: empresaUsuario ? empresaUsuario.empresaId : null,
                rolId: empresaUsuario ? empresaUsuario.rolId : null,
            };

            // Generar el token JWT
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Responder según el tipo de usuario
            if (empresaUsuario) {
                // Usuario asociado a una empresa
                return res.status(200).json({
                    success: true,
                    token,
                    userId: user.id,
                    empresaId: empresaUsuario.empresaId,
                    rolId: empresaUsuario.rolId,
                });
            } else {
                // Usuario normal sin empresa/rol
                return res.status(200).json({
                    success: true,
                    token,
                    userId: user.id,
                    empresaId: null,
                    rolId: null,
                });
            }

        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
