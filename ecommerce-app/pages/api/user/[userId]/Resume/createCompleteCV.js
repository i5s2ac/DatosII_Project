import { createCompleteCV } from "@/Controllers/cvController";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await createCompleteCV(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
