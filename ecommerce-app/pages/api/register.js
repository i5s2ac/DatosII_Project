import sequelize from '@/lib/sequelize';
import User from '../../models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password, phone } = req.body;

        // Validación de campos requeridos
        if (!username || !email || !password || !phone) {
            console.log('Missing required fields');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        try {
            console.log('Synchronizing database models...');
            await sequelize.sync();  // Sincroniza los modelos con la base de datos

            console.log('Authenticating the database connection...');
            await sequelize.authenticate();  // Autentica la conexión con la base de datos

            // Verifica si el email ya está en uso
            console.log('Checking if email is already in use...');
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log('Email already in use');
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            // Hashea la contraseña
            console.log('Hashing the password...');
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Crea el usuario
            console.log('Creating the user...');
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                telefono: phone
            });

            console.log('User successfully created:', user);
            res.status(201).json({ success: true, user });
        } catch (error) {
            console.error('Error creating user:', error);

            // Manejo de error para restricciones de unicidad
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.log('Unique constraint error: Email already in use');
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        console.log('Method not allowed');
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}