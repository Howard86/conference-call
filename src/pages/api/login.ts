import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidPassword } from '@/server/auth';

interface LoginResponse {
  success: boolean;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>,
): Promise<void> => {
  const { password } = req.body;

  switch (req.method) {
    case 'POST': {
      const success = await isValidPassword(password);
      return res.status(success ? 200 : 401).json({ success });
    }

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
