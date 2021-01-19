import type { NextApiRequest, NextApiResponse } from 'next';
import { getRoomByUID, deleteRoom } from '@/server/room';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const uid = req.query.uid as string;

  switch (req.method) {
    case 'GET': {
      const room = getRoomByUID(uid);
      if (!room) {
        return res.status(404).json({ success: false });
      }
      return res.status(200).json({ success: true, room });
    }

    case 'DELETE': {
      const success = deleteRoom(uid);
      return res.status(success ? 200 : 404).json({ success });
    }

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
