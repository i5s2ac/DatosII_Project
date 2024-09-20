import { loginUser } from '@/controllers/authController';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return loginUser(req, res);
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
