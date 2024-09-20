import { createJobOffer } from "@/Controllers/jobController";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await createJobOffer(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
