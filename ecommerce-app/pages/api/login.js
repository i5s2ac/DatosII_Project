import sequelize from '@/lib/sequelize';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            await sequelize.authenticate();

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = generateToken(user.id);
            res.status(200).json({ success: true, token, userId: user.id });
        } catch (error) {
            console.error('Error connecting to the database:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
