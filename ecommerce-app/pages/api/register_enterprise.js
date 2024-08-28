import sequelize from '@/lib/sequelize';
import Empresa from '@/models/Empresa';
import User from '@/models/User';
import Industria from '@/models/Industria';
import EmpresaUsuario from '@/models/EmpresaUsuario';
import Rol from '@/models/Rol';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            username,
            email,
            password,
            phone,
            companyName,
            direccion,
            descripcion,
            sitioWeb 
        } = req.body;

        // Validación de campos requeridos (sin sector)
        if (!username || !email || !password || !phone || !companyName) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        try {
            await sequelize.sync();  // Sincroniza los modelos con la base de datos
            await sequelize.authenticate();  // Autentica la conexión con la base de datos

            // Verifica si el email ya está en uso
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            // Crea el usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                telefono: phone,
            });

            // Crea la empresa
            const empresa = await Empresa.create({
                nombre: companyName,
                direccion, // Corregido
                telefono: phone,
                email,
                descripcion, // Corregido
                sitioWeb, // Asegúrate de que este campo esté incluido
                industriaId: 1,  // Aquí puedes poner un valor por defecto para el campo industriaId si es necesario
            });

            // Verifica si el rol "Admin" ya existe, si no, lo crea
            let adminRole = await Rol.findOne({ where: { nombre: 'Admin' } });
            if (!adminRole) {
                adminRole = await Rol.create({
                    nombre: 'Admin',
                    descripcion: 'Administrator of the company',
                });
            }

            // Relaciona el usuario con la empresa y el rol de Admin
            await EmpresaUsuario.create({
                empresaId: empresa.id,
                usuarioId: user.id,
                rolId: adminRole.id,
            });

            res.status(201).json({ success: true, empresa, user });
        } catch (error) {
            console.error('Error creating company and user:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
