import { updateCompleteCV } from "@/Controllers/cvController";

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        await updateCompleteCV(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
