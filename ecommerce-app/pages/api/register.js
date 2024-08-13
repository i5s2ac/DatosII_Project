import sequelize from '@/lib/sequelize';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        try {
            await sequelize.authenticate();

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await User.create({ username, email, password: hashedPassword });

            res.status(201).json({ success: true, user: newUser });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
