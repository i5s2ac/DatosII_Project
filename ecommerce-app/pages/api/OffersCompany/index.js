import { getJobOffersByCompany } from "@/Controllers/jobController";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getJobOffersByCompany(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}