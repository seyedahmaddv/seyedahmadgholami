import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const { data, error } = await supabase.from('services').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }
    case 'POST': {
      const { name, description, price } = req.body;
      const { data, error } = await supabase.from('services').insert([{ name, description, price }]);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
