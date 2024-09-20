import { checkApplicationStatus } from "@/Controllers/candidateController";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await checkApplicationStatus(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
