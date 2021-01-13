import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { getToken, updateToken } from '@/server/agora';
import config from '@/config';

// TODO: add dynamic channel name
const CHANNEL_NAME = 'conference';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  switch (req.method) {
    case 'GET': {
      const token = getToken(CHANNEL_NAME);

      return res.status(200).json({ success: !!token, token });
    }

    case 'POST': {
      const session = await getSession({ req });
      const isAdmin = session?.user?.email === config.adminEmail;

      if (!isAdmin) {
        return res.status(401).json({ success: false });
      }

      return res
        .status(200)
        .json({ success: true, token: updateToken(CHANNEL_NAME) });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
