import { updateJobOffer } from "@/Controllers/jobController";

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        await updateJobOffer(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
