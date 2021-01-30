import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllRooms, addRoom } from '@/server/room';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  switch (req.method) {
    case 'GET': {
      const rooms = getAllRooms();
      return res.status(200).json({ success: rooms.length !== 0, rooms });
    }

    case 'POST': {
      const Room = addRoom(req.body);
      return res.status(201).json({ success: true, Room });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
