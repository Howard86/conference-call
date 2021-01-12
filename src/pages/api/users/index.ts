import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers, addUser } from '@/server/user';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  switch (req.method) {
    case 'GET': {
      const users = getAllUsers();
      return res.status(200).json({ success: users.length !== 0, users });
    }

    case 'POST': {
      const user = addUser(req.body);
      return res.status(201).json({ success: true, user });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
