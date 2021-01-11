import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByUID, deleteUser } from '@/server/user-service';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const uid = req.query.uid as string;

  switch (req.method) {
    case 'GET': {
      const user = getUserByUID(uid);
      if (!user) {
        return res.status(404).json({ success: false });
      }
      return res.status(200).json({ success: true, user });
    }

    case 'DELETE': {
      const success = deleteUser(uid);
      return res.status(success ? 204 : 404).json({ success });
    }

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
