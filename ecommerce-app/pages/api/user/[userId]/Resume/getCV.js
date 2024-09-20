import { getCompleteCV } from "@/Controllers/cvController";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getCompleteCV(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
