import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { token, method, endpoint, data, baseUrl } = req.body || {};
    if (!token || !method || !endpoint) {
      res.status(400).json({ error: 'Missing token, method or endpoint' });
      return;
    }
    const root = baseUrl || process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com';
    const url = `${root}/api/v4${endpoint}`;
    const resp = await axios.request({
      method,
      url,
      data,
      headers: { Authorization: `Bearer ${token}` }
    });
    res.status(200).json(resp.data);
  } catch (e: any) {
    res.status(e?.response?.status || 500).json(e?.response?.data || { error: e.message });
  }
}


