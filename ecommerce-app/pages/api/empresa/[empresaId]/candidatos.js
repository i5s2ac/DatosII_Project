import { getCandidatesByCompany } from "@/Controllers/candidateController";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getCandidatesByCompany(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
