import { updateUserById } from '@/Controllers/userController';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        return updateUserById(req, res);
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
