import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import config from '@/config';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  switch (req.method) {
    case 'POST': {
      const session = await getSession({ req });
      const isAdmin = session?.user?.email === config.adminEmail;

      if (!isAdmin) {
        return res.status(401).json({ success: false });
      }

      // TODO: update Agora Token

      return res.status(200).json({ success: true });
    }

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
