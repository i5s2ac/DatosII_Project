import sequelize from '@/lib/sequelize';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            await sequelize.sync();
            
            await sequelize.authenticate();  // Verifica la conexión a la base de datos

            const user = await User.findOne({ where: { email } });

            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);  // Genera el token con id, email y username
                res.status(200).json({ success: true, token, userId: user.id });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error connecting to the database:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
