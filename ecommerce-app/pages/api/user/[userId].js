import { getUserById, updateUserById } from '@/../src/Controllers/userController';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getUserById(req, res);
    } else if (req.method === 'PUT') {
        await updateUserById(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
