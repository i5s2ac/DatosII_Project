import { getJobOfferById } from "@/Controllers/jobController";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getJobOfferById(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
