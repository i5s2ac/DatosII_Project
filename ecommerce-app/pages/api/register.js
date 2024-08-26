import sequelize from '@/lib/sequelize';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password, phone } = req.body;

        // Validación de campos requeridos
        if (!username || !email || !password || !phone) {
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

            // Hashea la contraseña
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Crea el usuario
            const user = await User.create({ 
                username, 
                email, 
                password: hashedPassword, 
                telefono: phone 
            });

            res.status(201).json({ success: true, user });
        } catch (error) {
            console.error('Error creating user:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
